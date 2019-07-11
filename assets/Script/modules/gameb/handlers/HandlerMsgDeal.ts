import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { room_status, RoomInterface } from "../RoomInterface";

/**
 * 发牌处理
 */
export namespace HandlerMsgDeal {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const msgDeal = proto.casino_xtsj.packet_sc_start_play.decode(msgData);
        console.log("HandlerMsgDeal---------------- ", msgDeal);
        //清理
        room.resetForNewHand();
        //播放开局动画 并等待
        await room.roomView.playAnimation("Effect_ico_kaiju", true);
        //播放庄动画 并等待
        let zhuangAni = "Effect_ico_huanzhuang";
        if (room.bankerChairID === msgDeal.lord_id) {
            zhuangAni = "Effect_ico_lianzhuang";
        }
        await room.roomView.playAnimation(zhuangAni, true);
        //播放定赖动画 并等待
        // await room.roomView.playAnimation("Effect_ico_dinglai", true);

        room.laiziID = msgDeal.laizi;
        room.laigenID = msgDeal.fanpai;
        room.setRoundMask();
        const players = room.getPlayers();
        //保存每一个玩家的牌列表
        const playersKeyArr = Object.keys(players);
        let playerNum = 0;
        for (const key of playersKeyArr) {
            const p = <Player>players[key];
            if (p.isMe()) {
                p.addHandTiles(msgDeal.cards);
                p.sortHands(false);
            } else {
                p.tileCountInHand = 13;
            }
            p.hand2UI(false);
            playerNum++;
        }

        //等待庄家出牌
        const player = <Player>room.getPlayerByUserID(msgDeal.lord_id.toString());
        room.setWaitingPlayer(player.chairID, msgDeal.time);

        room.bankerChairID = msgDeal.lord_id; //庄家
        room.setBankerFlag();
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
        room.onUpdateStatus(room_status.onPlay);
    };
}
