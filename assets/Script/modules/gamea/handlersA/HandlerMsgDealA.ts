import { DataStore, KeyConstants, Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { PlayerA } from "../PlayerA";
import { PlayerInterfaceA } from "../PlayerInterfaceA";
import { RoomInterfaceA, roomStatus } from "../RoomInterfaceA";

//发牌个数
const dealNum: number[] = [
    4, 4, 4, 1
];
/**
 * 发牌处理
 */
export namespace HandlerMsgDealA {
    const onPlayDealAni = async (room: RoomInterfaceA, cards: number[], lordChairId: number): Promise<void> => {
        const players = room.getPlayers();
        const playersKeyArr = Object.keys(players);
        const playerNum = playersKeyArr.length;
        //按庄家第一的顺序排序
        const playersArr: PlayerA[] = [];
        for (const key of playersKeyArr) {
            const p = <PlayerA>players[key];
            const c = (p.chairID - lordChairId + playerNum) % playerNum;
            playersArr[c] = p;

            if (room.isReplayMode()) {
                p.tilesHand = [];
                p.tileCountInHand = -1;
            }
        }

        //发牌动画
        const dealNumLength = dealNum.length;
        if (room.isReplayMode()) {
            room.initReplayCardsOfChairId(cards[0]); //克隆牌组
            for (let i = 0; i < dealNumLength; i++) {
                const num = dealNum[i];
                for (const p of playersArr) {
                    if (p !== undefined && p !== null) {
                        const ccs = room.getReplayCardsOfChairId(p.chairID);
                        const cs = ccs.splice(0, num);
                        p.addHandTiles(cs);
                        p.playerView.showDeal();
                        await room.coWaitSeconds(0.15);
                    }
                }
            }
        } else {
            for (let i = 0; i < dealNumLength; i++) {
                const num = dealNum[i];
                const cs = cards.splice(0, num);
                for (const p of playersArr) {
                    if (p !== undefined && p !== null) {
                        p.addHandTiles(cs);
                        p.playerView.showDeal();
                        await room.coWaitSeconds(0.15);
                    }
                }
            }
        }

        for (const p of playersArr) {
            if (room.isReplayMode()) {
                p.playerView.hideLights();
            } else {
                p.playerView.hideHands();
            }
            p.playerView.hand2.visible = true;
        }
        await room.coWaitSeconds(0.3);
        for (const p of playersArr) {
            p.playerView.hand2.visible = false;
        }
    };

    const getPlayerImaccids = (players: { [key: string]: PlayerInterfaceA }): string[] => {
        const imaccids: string[] = [];
        const myImaccid = DataStore.getString(KeyConstants.IM_ACCID);
        const keys = Object.keys(players);
        Logger.debug("getPlayerImaccids, keys:", keys);
        for (const key of keys) {
            const player = <PlayerA>players[key];
            if (player.playerInfo.imaccid !== myImaccid && !player.playerInfo.isRobot) {
                imaccids.push(player.playerInfo.imaccid);
            }
        }

        return imaccids;
    };

    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const msgDeal = proto.casino_gdy.packet_sc_start_play.decode(msgData);
        console.log("HandlerMsgDeal---------------- ", msgDeal);
        // room.getRoomHost().eventTarget.emit("onDeal");
        room.roomView.showOrHideReadyView(false);

        const imaccids = getPlayerImaccids(room.getPlayers());
        room.getRoomHost().createTeam(imaccids, `${room.roomInfo.tag}`);

        room.isGameOver = false;
        // 显示默认隐藏的view
        room.showRoomBtnsAndBgs();
        //清理
        room.resetForNewHand();

        // 清理游戏操作提示
        room.hideGamePauseTips();
        //局数
        if (!room.isReplayMode()) {
            room.handStartted++;
        }
        room.showRoomNumber();
        //播放开局动画 并等待
        if (room.handStartted === 1) {
            //第一局才需要音效
            room.playSound("mj_kj");
        }
        await room.roomView.playAnimation("Effect_ico_kaiju", true);
        //播放庄动画 并等待
        room.playSound("sound_dingzhuang");
        if (room.bankerChairID === msgDeal.lord_id) {
            //连庄
            await room.roomView.playAnimation("Effect_ico_lianzhuang", true);
        } else if (room.bankerChairID !== -1) {
            //换庄
            await room.roomView.playAnimation("Effect_ico_huanzhuang", true);
        }
        await room.coWaitSeconds(0.5);
        const time = 0.6; //飞庄动画时间
        const player = <PlayerA>room.getPlayerByPlayerID(msgDeal.lord_id);
        room.roomView.playZhuangAni(player.playerView.head.bankerFlag, time);
        await room.coWaitSeconds(time);

        //播放定赖动画 并等待
        room.laiziID = msgDeal.laizi;
        room.laigenID = msgDeal.fanpai;
        room.roomView.playLaiAni();
        // await room.coWaitSeconds(0.5);

        const players = room.getPlayers();

        const playersKeyArr = Object.keys(players);
        let playerNum = 0;
        await onPlayDealAni(room, msgDeal.cards, player.chairID);
        //显示牌
        for (const key of playersKeyArr) {
            const p = <PlayerA>players[key];
            // if (p.isMe()) {
            p.sortHands(false);
            // }
            p.hand2UI(false);
            playerNum++;
        }
        //牌墙 三个花色 108 张 每人13张 加上 一张翻拍
        room.tilesInWall = 108 - ((playerNum * 13) + 1);
        room.updateTilesInWallUI();
        //等待庄家出牌
        // room.setWaitingPlayer(player.chairID, msgDeal.time);

        room.bankerChairID = msgDeal.lord_id; //庄家
        room.mAlgorithm.setMahjongLaiZi(msgDeal.laizi);
        room.mAlgorithm.setMahjongFan(msgDeal.fanpai);
        room.mAlgorithm.setFlagPiao(false);
        //房间状态
        room.onUpdateStatus(roomStatus.onPlay);

        if (room.handStartted <= 1) {
            room.roomView.showGpsView();
        }
    };
}
