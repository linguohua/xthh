import { proto } from "../lobby/protoHH/protoHH";

export interface DataInterface {
    player_id?: number;
    card?: number;
    time?: number;
    scores?: IplayerScore[];
    op?: number;
    // tslint:disable-next-line:no-reserved-keywords
    type?: number;
    target_id?: number;
    cards?: number[];
    fanpai?: number;
    laizi?: number;
    lord_id?: number;
}
export interface IplayerScore {
    player_id?: number;
    score_add?: number;
}
export enum RoomId {
    XTHH = 2100, //仙桃晃晃
    SRLM = 2103, //三人两门
    LRLM = 2112 //两人两门
}
/**
 *  游戏差异类
 */
export namespace GameRules {
    //出牌
    export const tableOutcardAck = (msgData: ByteBuffer, roomid: number): DataInterface => {
        if (roomid === RoomId.XTHH) {
            const reply = proto.casino_gdy.packet_sc_outcard_ack.decode(msgData);

            return { card: reply.card, player_id: reply.player_id };
        } else {
            const reply = proto.casino_xtsj.packet_sc_outcard_ack.decode(msgData);

            return { card: reply.card, player_id: reply.player_id };
        }
    };
    //抽牌
    export const tableDrawcard = (msgData: ByteBuffer, roomid: number): DataInterface => {
        if (roomid === RoomId.XTHH) {
            const reply = proto.casino_gdy.packet_sc_drawcard.decode(msgData);

            return { card: reply.card, player_id: reply.player_id, time: reply.time };
        } else {
            const reply = proto.casino_xtsj.packet_sc_drawcard.decode(msgData);

            return { card: reply.card, player_id: reply.player_id, time: reply.time };
        }
    };
    //最后几张
    export const tableEndcard = (msgData: ByteBuffer, roomid: number): DataInterface => {
        if (roomid === RoomId.XTHH) {
            const reply = proto.casino_gdy.packet_sc_endcard.decode(msgData);

            return { card: reply.card };
        } else {
            const reply = proto.casino_xtsj.packet_sc_endcard.decode(msgData);

            return { card: reply.card };
        }
    };
    //分数
    export const actionScore = (msgData: ByteBuffer, roomid: number): DataInterface => {
        if (roomid === RoomId.XTHH) {
            const reply = proto.casino_gdy.packet_sc_score.decode(msgData);

            return { scores: reply.scores };
        } else {
            const reply = proto.casino_xtsj.packet_sc_score.decode(msgData);

            return { scores: reply.scores };
        }
    };
    //op
    export const actionOP = (msgData: ByteBuffer, roomid: number): DataInterface => {
        if (roomid === RoomId.XTHH) {
            const reply = proto.casino_gdy.packet_sc_op.decode(msgData);

            return { player_id: reply.player_id, card: reply.card };
        } else {
            const reply = proto.casino_xtsj.packet_sc_op.decode(msgData);

            return { player_id: reply.player_id, card: reply.card };
        }
    };
    export const actionOPAck = (msgData: ByteBuffer, roomid: number): DataInterface => {
        if (roomid === RoomId.XTHH) {
            const reply = proto.casino_gdy.packet_sc_op_ack.decode(msgData);

            return {
                player_id: reply.player_id, target_id: reply.target_id,
                cards: reply.cards, type: reply.type, op: reply.op
            };
        } else {
            const reply = proto.casino_xtsj.packet_sc_op_ack.decode(msgData);

            return {
                player_id: reply.player_id, target_id: reply.target_id,
                cards: reply.cards, type: reply.type, op: reply.op
            };
        }
    };
    //发牌
    export const tableStartPlay = (msgData: ByteBuffer, roomid: number): DataInterface => {
        if (roomid === RoomId.XTHH) {
            const reply = proto.casino_gdy.packet_sc_start_play.decode(msgData);

            return { cards: reply.cards, player_id: reply.player_id, lord_id: reply.lord_id, time: reply.time };
        } else {
            const reply = proto.casino_xtsj.packet_sc_start_play.decode(msgData);

            return { cards: reply.cards, player_id: reply.player_id, lord_id: reply.lord_id, time: reply.time };
        }
    };
}
