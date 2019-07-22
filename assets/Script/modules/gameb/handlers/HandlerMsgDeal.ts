import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { RoomInterface, roomStatus } from "../RoomInterface";
import { Logger } from "../../lobby/lcore/Logger";

//发牌个数
const dealNum: number[] = [
    4, 4, 4, 1
];
/**
 * 发牌处理
 */
export namespace HandlerMsgDeal {

    const onPlayDealAni = async (room: RoomInterface, cards: number[], lordChairId: number): Promise<void> => {
        const players = room.getPlayers();
        const playersKeyArr = Object.keys(players);
        const playerNum = playersKeyArr.length;
        //按庄家第一的顺序排序
        const playersArr: Player[] = [];
        for (const key of playersKeyArr) {
            const p = <Player>players[key];
            const c = (p.chairID - lordChairId + playerNum) % playerNum;
            playersArr[c] = p;
        }

        //发牌动画
        for (let i = 0; i < dealNum.length; i++) {
            const num = dealNum[i];
            // for (let j = 0; j < 4; j++) {
            for (const p of playersArr) {
                // const p = <Player>room.getPlayerByChairID(j);
                // const p = <Player>players[key];
                if (p !== undefined && p !== null) {
                    if (p.isMe()) {
                        p.addHandTiles(cards.splice(0, num));
                    } else {
                        if (p.tileCountInHand === undefined || p.tileCountInHand === null) {
                            p.tileCountInHand = 0;
                        }
                        p.tileCountInHand += num;
                    }
                    p.playerView.showDeal();
                    // p.hand2UI(false);
                    await room.coWaitSeconds(0.3);
                }
            }
        }

        for (const p of playersArr) {
            p.playerView.hideHands();
            p.playerView.hand2.visible = true;
        }
        await room.coWaitSeconds(0.5);
        for (const p of playersArr) {
            p.playerView.hand2.visible = false;
        }
    };
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const msgDeal = proto.casino_xtsj.packet_sc_start_play.decode(msgData);
        console.log("HandlerMsgDeal---------------- ", msgDeal);
        room.getRoomHost().eventTarget.emit("onDeal");
        // 显示默认隐藏的view
        room.showRoomBtnsAndBgs();
        //清理
        room.resetForNewHand();
        //播放开局动画 并等待
        await room.roomView.playAnimation("Effect_ico_kaiju", true);
        //播放庄动画 并等待
        if (room.bankerChairID === msgDeal.lord_id) {
            //连庄
            room.roomView.playAnimation("Effect_ico_lianzhuang", true);
        } else if (room.bankerChairID !== -1) {
            //换庄
            room.roomView.playAnimation("Effect_ico_huanzhuang", true);
        }
        await room.coWaitSeconds(0.5);
        const player = <Player>room.getPlayerByUserID(msgDeal.lord_id.toString());
        room.roomView.playZhuangAni(player.playerView.head.bankerFlag);
        await room.coWaitSeconds(1);

        //播放定赖动画 并等待
        room.laiziID = msgDeal.laizi;
        room.laigenID = msgDeal.fanpai;
        room.roomView.playLaiAni();
        await room.coWaitSeconds(1);

        const players = room.getPlayers();

        const playersKeyArr = Object.keys(players);
        let playerNum = 0;
        await onPlayDealAni(room, msgDeal.cards, player.chairID);
        //显示牌
        for (const key of playersKeyArr) {
            const p = <Player>players[key];
            if (p.isMe()) {
                p.sortHands(false);
            }
            p.hand2UI(false);
            playerNum++;
        }

        //等待庄家出牌
        room.setWaitingPlayer(player.chairID, msgDeal.time);

        room.bankerChairID = msgDeal.lord_id; //庄家
        room.mAlgorithm.setMahjongLaiZi(msgDeal.laizi);
        room.mAlgorithm.setMahjongFan(msgDeal.fanpai);
        room.mAlgorithm.setFlagPiao(false);
        //局数
        room.handStartted++;
        room.showRoomNumber();
        //牌墙 两个花色 72 张 每人13张 加上 一张翻拍
        room.tilesInWall = 72 - ((playerNum * 13) + 1);
        room.updateTilesInWallUI();
        //房间状态
        room.onUpdateStatus(roomStatus.onPlay);
    };
}
