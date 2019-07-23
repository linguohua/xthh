import { RoomHost } from "../../interface/LInterfaceExports";
import { CommonFunction, DataStore, Dialog, HTTP, LEnv, Logger } from "../../lcore/LCoreExports";
import { proto } from "../../protoHH/protoHH";

interface RoomInterface {
    getRoomHost(): RoomHost;

    onDissolveClicked(): void;

}

interface PlayerInfo {
    userID: string;
    gender: number;
    headIconURI: string;
    nick: string;
}

interface PlayerInterface {
    playerInfo: PlayerInfo;
    coordinate: proto.casino.coordinate;
}

const gpsPlayerNumberIndex: { [key: number]: number } = {
    [2]: 0,
    [3]: 1,
    [4]: 2
};

const twoPlayerPair: number[][] = [
    [0, 1]
];

const threePlayerPair: number[][] = [
    [0, 1],
    [0, 2],
    [1, 2]
];

const fourPlayerPair: number[][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3]
];

const EARTH_RADIUS = 6378.137; //地球半径,单位千米
/**
 * 解散页面
 */
export class GpsView extends cc.Component {

    private view: fgui.GComponent;

    private win: fgui.Window;

    private roomHost: RoomHost;

    private room: RoomInterface;

    private players: PlayerInterface[];

    private eventTarget: cc.EventTarget;

    public updateGpsView(room: RoomInterface, players: PlayerInterface[]): void {
        this.room = room;
        this.players = players;
        this.roomHost = room.getRoomHost();
        const loader = this.roomHost.getLobbyModuleLoader();
        if (this.view === null || this.view === undefined) {
            loader.fguiAddPackage("lobby/fui_room_other_view/room_other_view");
            const view = fgui.UIPackage.createObject("room_other_view", "gps").asCom;

            CommonFunction.setViewInCenter(view);

            const bg = view.getChild("mask");
            CommonFunction.setBgFullScreenSize(bg);

            this.view = view;
            const win = new fgui.Window();
            win.contentPane = view;
            win.modal = true;

            this.win = win;

            this.win.show();

            this.initView();
        }
    }

    protected onLoad(): void {
        this.eventTarget = new cc.EventTarget();
    }

    protected onDestroy(): void {
        this.view.dispose();
        this.win.hide();
        this.win.dispose();
    }

    private initView(): void {
        const disbandBtn = this.view.getChild("disbandBtn");
        disbandBtn.onClick(this.onDisbandBtnClick, this);

        const continueBtn = this.view.getChild("continueBtn");
        continueBtn.onClick(this.onContinueBtnClick, this);

        const controller = this.view.getController("playerNumer");
        const index = gpsPlayerNumberIndex[this.players.length];
        controller.selectedIndex = index;

        this.initDistanceView();
    }

    private initDistanceView(): void {
        this.initPlayerDistanceView();
    }

    private initPlayerDistanceView(): void {
        this.sortPlayer();
        const playerLength = this.players.length;

        let playerPairNumber: number = 0;
        let distanceView: fgui.GComponent = null;

        if (playerLength === 2) {
            playerPairNumber = twoPlayerPair.length;
            distanceView = this.view.getChild("twoPlayer").asCom;
        } else if (playerLength === 3) {
            playerPairNumber = threePlayerPair.length;
            distanceView = this.view.getChild("threePlayer").asCom;
        } else if (playerLength === 4) {
            playerPairNumber = fourPlayerPair.length;
            distanceView = this.view.getChild("fourPlayer").asCom;
        } else {
            Logger.error("Unkonw player number:", playerLength);

            return;
        }

        const warningText = distanceView.getChild("warningText");
        warningText.visible = false;

        for (let i = 0; i < playerLength; i++) {
            const player = this.players[i];

            const head = distanceView.getChild(`loader${i + 1}`).asLoader;
            const name = distanceView.getChild(`name${i + 1}`);
            const address = distanceView.getChild(`city${i + 1}`);

            CommonFunction.setHead(head, player.playerInfo.headIconURI, player.playerInfo.gender);
            name.text = player.playerInfo.nick;

            if (player.coordinate === null || player.coordinate.latitude === null) {
                address.text = "未获取位置";
            } else {
                this.setAddress(player.coordinate, address);
                // opponentAddress.text = this.getPlayerAddress(player.coordinate);
            }

        }

        for (let i = 0; i < playerPairNumber; i++) {
            const pair = threePlayerPair[i];
            const player1 = this.players[pair[0]];
            const player2 = this.players[pair[1]];

            const ctrl = distanceView.getController(`${pair[0] + 1}${pair[1] + 1}Ctrl`);
            const name = `${pair[0] + 1}_${pair[1] + 1}_label`;
            const distanceText = distanceView.getChild(`${name}`);
            if (player1.coordinate === null || player1.coordinate.latitude === null) {
                distanceText.text = "未知距离";
                ctrl.selectedIndex = 0;
                continue;
            }

            if (player2.coordinate === null || player2.coordinate.latitude === null) {
                distanceText.text = "未知距离";
                ctrl.selectedIndex = 0;
                continue;
            }

            // 绿色
            ctrl.selectedIndex = 1;

            const distance = this.calculateDistance(player1.coordinate, player2.coordinate);
            if (distance > 1000) {
                distanceText.text = `${distance / 1000}千米`;
            } else {
                distanceText.text = `${distance}米`;
                if (distance < 100) {
                    warningText.text = "发现距离过近";
                    warningText.visible = true;

                    // 红色
                    ctrl.selectedIndex = 2;
                }
            }
        }

    }

    private onDisbandBtnClick(): void {
        const room = this.room;
        Dialog.showDialog("你确定要发起解散当前的牌局吗？", () => {
            room.onDissolveClicked();
            // tslint:disable-next-line:align
        }, () => {
            //
        });

        this.destroy();
    }

    private onContinueBtnClick(): void {
        this.destroy();
    }

    private calculateDistance(coordinate1: proto.casino.coordinate, coordinate2: proto.casino.coordinate): number {
        Logger.debug(`coordinate1, lant:${coordinate1.latitude}, long:${coordinate1.longitude},
        coordinate2, lant:${coordinate2.latitude}, long:${coordinate2.longitude}`);
        const radLat1 = this.rad(coordinate1.latitude);
        const radLat2 = this.rad(coordinate2.latitude);
        const a = radLat1 - radLat2;
        const b = this.rad(coordinate1.longitude) - this.rad(coordinate2.longitude);
        let s = Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2))) * 2;
        s = s * EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        Logger.debug("calculateDistance, distance:", s);

        return s;
    }

    private rad(d: number): number {
        return d * Math.PI / 180;
    }

    private setAddress(coordinate: proto.casino.coordinate, obj: fgui.GObject): void {
        if (coordinate === null || coordinate === undefined) {
            obj.text = "未获取位置";

            return;
        }

        const url = `${LEnv.qqmapGeoCoder}${coordinate.latitude},${coordinate.longitude}&key=${LEnv.qqmapKey}&output=json`;
        Logger.debug("url:", url);

        HTTP.hGet(
            this.eventTarget,
            url,
            (xhr: XMLHttpRequest, err: string) => {

                let errMsg;
                if (err !== null) {
                    errMsg = `错误码: ${err} `;
                    Dialog.showDialog(errMsg);

                } else {
                    errMsg = HTTP.hError(xhr);

                    if (errMsg === null) {
                        Logger.debug("xhr.responseText:", xhr.responseText);
                        const jsonObj = JSON.parse(xhr.responseText);
                        if (jsonObj.status !== 0) {
                            Dialog.showDialog(jsonObj.message);
                            obj.text = "未获取位置";
                            Logger.debug(`load user address error, status${jsonObj.status}, message:${jsonObj.message}`);

                            return;
                        }

                        obj.text = jsonObj.result.address;
                    }
                }

            },
            "text");
    }

    // 将自己放在第一个
    private sortPlayer(): void {
        const myID = DataStore.getString("playerID");
        const playerLength = this.players.length;
        for (let i = 0; i < playerLength; i++) {
            const p = this.players[i];
            if (`${p.playerInfo.userID}` === `${myID}`) {
                this.players.splice(i, 1);
                this.players.unshift(p);
                break;
            }
        }
    }
    // private calculateDistance2(coordinate1: proto.casino.coordinate, coordinate2: proto.casino.coordinate, callback: Function): void {
    //     Logger.debug(`calculateDistance, coordinate1:${coordinate1}, coordinate2:${coordinate2}`);

    //     let url = `${LEnv.qqmapDistance}mode=straight&from=${coordinate1.latitude},${coordinate1.longitude}`;
    //     url = `${url}&to=${coordinate2.latitude},${coordinate2.longitude}&key=${LEnv.qqmapKey}`;

    //     Logger.debug("url:", url);

    //     HTTP.hGet(this.eventTarget, url, (xhr: XMLHttpRequest, err: string) => {
    //         let errMsg;
    //         if (err !== null) {
    //             callback(err, null);

    //         } else {
    //             errMsg = HTTP.hError(xhr);

    //             if (errMsg === null) {
    //                 const jsonObj = JSON.parse(xhr.responseText);
    //                 callback(null, jsonObj);
    //             }
    //         }

    //     });
    // }

}
