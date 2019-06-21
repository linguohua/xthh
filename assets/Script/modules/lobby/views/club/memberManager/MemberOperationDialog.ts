import { CommonFunction, DataStore, Dialog, HTTP, LEnv, Logger } from "../../../lcore/LCoreExports";
import { proto } from "../../../proto/protoLobby";
import { ClubViewInterface } from "../ClubModuleInterface";
import { ClubRequestError } from "../ClubRequestError";

/**
 * 成员管理，对成员进行操作
 */
export class MemberOperationDialog extends cc.Component {

    private view: fgui.GComponent;

    private member: proto.club.IMsgClubMemberInfo;

    private memberView: ClubViewInterface;

    private clubInfo: proto.club.IMsgClubInfo;

    private eventTarget: cc.EventTarget;

    public bind(memberView: ClubViewInterface, clubInfo: proto.club.IMsgClubInfo, member: proto.club.IMsgClubMemberInfo): void {
        this.memberView = memberView;
        this.member = member;
        this.clubInfo = clubInfo;

        const memberOperationDialog = fgui.UIPackage.createObject("lobby_club", "memberOperationDialog").asCom;
        this.view = memberOperationDialog;

        this.initView();
        fgui.GRoot.inst.showPopup(this.view);
        this.view.setPosition(255, 180);

    }

    private initView(): void {

        this.eventTarget = new cc.EventTarget();
        const revokeBtn = this.view.getChild("revokeBtn").asButton;
        revokeBtn.onClick(this.onRevokeBtnClick, this);

        const up2ManagerBtnBtn = this.view.getChild("up2ManagerBtnBtn").asButton;
        up2ManagerBtnBtn.onClick(this.onUp2ManagerBtnBtnClick, this);

        const authorize2CreateRoomBtn = this.view.getChild("authorize2CreateRoomBtn").asButton;
        authorize2CreateRoomBtn.onClick(this.onAuthorize2CreateRoomBtnClick, this);

        const delMemberBtn = this.view.getChild("delMemberBtn").asButton;
        delMemberBtn.onClick(this.onDelMemberBtnClick, this);

        const cancelAuthBtn = this.view.getChild("cancelAuthBtn").asButton;
        cancelAuthBtn.onClick(this.onCancelAuthBtnClick, this);

        const nameText = this.view.getChild("name").asTextField;
        const idText = this.view.getChild("id").asTextField;

        nameText.text = this.member.displayInfo.nick === "" ? `${this.member.userID}` : this.member.displayInfo.nick;
        idText.text = `ID : ${this.member.userID}`;

        const loader = this.view.getChild("loader").asLoader;
        CommonFunction.setHead(loader, this.member.displayInfo.headIconURL);

        this.updateController();

    }

    private updateController(): void {

        const isManager = this.member.role === proto.club.ClubRoleType.CRoleTypeMgr;

        const memberLevelCtrl = this.view.getController("memberLevel");
        const isAuthCtrl = this.view.getController("isAuth");
        // // 0 是群主 1 是 管理员，2 是群员
        // memberLevelCtrl.selectedIndex = 1;
        // // 0 是已经授权，1是未授权
        // isAuthCtrl.selectedIndex = 1;
        const authorize2CreateRoomBtn = this.view.getChild("authorize2CreateRoomBtn").asButton;
        const cancelAuthBtn = this.view.getChild("cancelAuthBtn").asButton;
        if (isManager) {
            authorize2CreateRoomBtn.grayed = true;
            authorize2CreateRoomBtn._touchDisabled = true;

            cancelAuthBtn.grayed = true;
            cancelAuthBtn._touchDisabled = true;
        } else {
            authorize2CreateRoomBtn.grayed = false;
            authorize2CreateRoomBtn._touchDisabled = false;

            cancelAuthBtn.grayed = false;
            cancelAuthBtn._touchDisabled = false;
        }

        memberLevelCtrl.selectedIndex = isManager ? 1 : 2;
        isAuthCtrl.selectedIndex = isManager ? 0 : (this.member.allowCreateRoom ? 0 : 1);
    }

    private onRevokeBtnClick(): void {

        this.onUp2ManagerBtnBtnClick();
    }

    private onUp2ManagerBtnBtnClick(): void {

        const isManager = this.member.role === proto.club.ClubRoleType.CRoleTypeMgr;

        const role = isManager ? proto.club.ClubRoleType.CRoleTypeMember : proto.club.ClubRoleType.CRoleTypeMgr;
        this.changeManagerRequest(this.member, role);
    }

    private onAuthorize2CreateRoomBtnClick(): void {

        this.createRoomAuthority(true);
    }

    private onDelMemberBtnClick(): void {
        const member = this.member;
        const nick = member.displayInfo.nick === "" ? member.userID : member.displayInfo.nick;
        Dialog.showDialog(`是否删除 ${nick} ?`, () => {

            this.memberView.delMember(this.member);
            this.destroy();
            // tslint:disable-next-line:align
        }, () => {
            //
        });
    }

    private onCancelAuthBtnClick(): void {

        this.createRoomAuthority(false);
    }

    private createRoomAuthority(authority: boolean): void {

        const result: string = authority === true ? "yes" : "no";
        const tk = DataStore.getString("token", "");
        const baseUrl = `${LEnv.rootURL}${LEnv.allowMemberCreateRoom}?&`;
        const params = `tk=${tk}&clubID=${this.clubInfo.baseInfo.clubID}&memberID=${this.member.userID}&allowCreateRoom=${result}`;
        const url = `${baseUrl}${params}`;

        const cb = (xhr: XMLHttpRequest, err: string) => {

            const data = <Uint8Array>xhr.response;
            const msgClubReply = proto.club.MsgClubReply.decode(data);
            if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCOperation) {
                const rspMember = proto.club.MsgClubMemberInfo.decode(msgClubReply.content);
                this.changeAuthority(rspMember);
            } else if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCError) {
                const msgCubOperGenericReply = proto.club.MsgCubOperGenericReply.decode(msgClubReply.content);
                if (msgCubOperGenericReply.errorCode !== proto.club.ClubOperError.CERR_OK) {
                    ClubRequestError.showErrMsg(msgCubOperGenericReply.errorCode);
                }
            }

        };

        this.clubRequest(url, cb);
    }

    private changeAuthority(member: proto.club.IMsgClubMemberInfo): void {

        this.saveMember(member);
        this.updateController();
    }
    /**
     * 只覆盖属性，对象不变
     * @param member 返回来的新对象
     */
    private saveMember(member: proto.club.IMsgClubMemberInfo): void {
        this.member.allowCreateRoom = member.allowCreateRoom;
        this.member.displayInfo = member.displayInfo;
        this.member.online = member.online;
        this.member.role = member.role;
        this.member.userID = member.userID;
    }

    private changeManagerRequest(member: proto.club.IMsgClubMemberInfo, role: proto.club.ClubRoleType): void {

        const tk = DataStore.getString("token", "");
        const baseUrl = `${LEnv.rootURL}${LEnv.changeRole}?&`;
        const params = `tk=${tk}&clubID=${this.clubInfo.baseInfo.clubID}&memberID=${member.userID}&role=${role}`;
        const url = `${baseUrl}${params}`;

        const cb = (xhr: XMLHttpRequest, err: string) => {

            const data = <Uint8Array>xhr.response;
            const msgClubReply = proto.club.MsgClubReply.decode(data);

            if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCOperation) {
                const rspMember = proto.club.MsgClubMemberInfo.decode(msgClubReply.content);
                this.changeManager(rspMember, role);
            } else if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCError) {
                const msgCubOperGenericReply = proto.club.MsgCubOperGenericReply.decode(msgClubReply.content);
                if (msgCubOperGenericReply.errorCode !== proto.club.ClubOperError.CERR_OK) {
                    ClubRequestError.showErrMsg(msgCubOperGenericReply.errorCode);
                }
            }

        };

        this.clubRequest(url, cb);
    }

    private changeManager(member: proto.club.IMsgClubMemberInfo, role: proto.club.ClubRoleType): void {

        if (role === proto.club.ClubRoleType.CRoleTypeMgr) {
            this.clubInfo.managers.push(member.userID);
        } else {
            const index = this.clubInfo.managers.indexOf(member.userID);
            this.clubInfo.managers.splice(index, 1);
        }

        this.saveMember(member);
        this.updateController();
    }
    /**
     * 网络请求
     * @param url 链接
     * @param cb 回调
     */
    private clubRequest(url: string, cb: Function): void {
        if (url === null) {
            return null;
        }

        Logger.debug("clubRequest url = ", url);

        HTTP.hGet(this.eventTarget, url, (xhr: XMLHttpRequest, err: string) => {

            cb(xhr, err);
        });
    }

}
