import { CommonFunction, DataStore, HTTP, LEnv, Logger } from "../../../lcore/LCoreExports";
import { proto } from "../../../proto/protoLobby";
import { ClubRequestError } from "../ClubRequestError";

const { ccclass } = cc._decorator;

/**
 * 任命管理
 */
@ccclass
export class AppointManagerView extends cc.Component {

    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;

    private clubInfo: proto.club.IMsgClubInfo;

    private managers: proto.club.IMsgClubMemberInfo[];

    private membersWithoutManager: proto.club.IMsgClubMemberInfo[];

    private managerList: fgui.GList;
    private memberList: fgui.GList;

    public show(clubInfo: proto.club.IMsgClubInfo): void {
        this.clubInfo = clubInfo;
        this.win.show();
        this.loadClubMgrs();
    }

    protected onLoad(): void {
        //
        this.eventTarget = new cc.EventTarget();

        const view = fgui.UIPackage.createObject("lobby_club", "appointManager").asCom;
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.initView();
    }

    protected onDestroy(): void {

        this.eventTarget.emit("destroy");
        this.win.hide();
        this.win.dispose();
    }

    private onCloseClick(): void {
        this.destroy();
    }

    private initView(): void {
        //

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        this.managerList = this.view.getChild("managerList").asList;
        this.memberList = this.view.getChild("memberList").asList;

        this.managerList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderManagerListItem(index, item);
        };

        this.memberList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderMemberListItem(index, item);
        };
        this.memberList.setVirtual();

    }

    private renderMemberListItem(index: number, item: fgui.GObject): void {
        //

        const members = this.membersWithoutManager;
        const member = members[index];

        const controller = item.asCom.getController("item");

        controller.selectedIndex = 2;

        const nameText = item.asCom.getChild("name").asTextField;
        const idText = item.asCom.getChild("id").asTextField;

        nameText.text = member.displayInfo.nick === "" ? `${member.userID}` : member.displayInfo.nick;
        idText.text = `ID : ${member.userID}`;

        const loader = item.asCom.getChild("loader").asLoader;
        CommonFunction.setHead(loader, member.displayInfo.headIconURL);

        const up2ManagerBtn = item.asCom.getChild("up2ManagerBtn").asButton;

        up2ManagerBtn.offClick(this.up2ManagerBtn, this);
        up2ManagerBtn.onClick(this.up2ManagerBtn, this);
        up2ManagerBtn.data = member;

    }

    private up2ManagerBtn(ev: fgui.Event): void {
        const member = <proto.club.IMsgClubMemberInfo>ev.initiator.data;
        const role = proto.club.ClubRoleType.CRoleTypeMgr;
        this.changeManagerRequest(member, role);
    }
    private onRemoveBtnClick(ev: fgui.Event): void {
        const manager = <proto.club.IMsgClubMemberInfo>ev.initiator.data;
        this.changeManagerRequest(manager, proto.club.ClubRoleType.CRoleTypeMember);
    }

    private onAddBtnClick(): void {
        this.view.getController("view").selectedIndex = 1;
        this.loadMember();
    }

    private loadClubMgrs(): void {
        //
        const tk = DataStore.getString("token", "");
        const loadRecordUrl = `${LEnv.rootURL}${LEnv.loadClubMgrs}?&tk=${tk}&clubID=${this.clubInfo.baseInfo.clubID}`;

        const cb = (xhr: XMLHttpRequest, err: string) => {
            //
            const data = <Uint8Array>xhr.response;
            const msgClubReply = proto.club.MsgClubReply.decode(data);
            if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCOperation) {
                const reply = proto.club.MsgClubLoadMembersReply.decode(msgClubReply.content);

                const members = reply.members;
                this.updateManagerList(members);

            }
        };

        this.clubRequest(loadRecordUrl, cb);

    }

    private updateManagerList(members: proto.club.IMsgClubMemberInfo[]): void {
        this.managers = members;
        this.managerList.numItems = 2;
    }

    private updateMemberList(members: proto.club.IMsgClubMemberInfo[]): void {
        //
        this.membersWithoutManager = [];

        // 只有两人，暂时内部嵌套
        const managers = this.clubInfo.managers;
        for (const member of members) {

            if (member.userID === this.clubInfo.creatorUserID) {
                continue;
            }

            let isManager = false;
            for (const managerId of managers) {
                if (member.userID === managerId) {
                    isManager = true;
                }
            }

            if (isManager === false) {
                this.membersWithoutManager.push(member);
            }

        }

        this.memberList.numItems = this.membersWithoutManager.length;
    }
    private renderManagerListItem(index: number, item: fgui.GObject): void {
        //

        const managers = this.managers;
        const manager = managers[index];

        const controller = item.asCom.getController("item");

        if (manager === null || manager === undefined) {
            controller.selectedIndex = 1;
            const add = item.asCom.getChild("add").asButton;

            add.offClick(this.onAddBtnClick, this);
            add.onClick(this.onAddBtnClick, this);
        } else {
            controller.selectedIndex = 0;

            const nameText = item.asCom.getChild("name").asTextField;
            const idText = item.asCom.getChild("id").asTextField;

            nameText.text = manager.displayInfo.nick === "" ? `${manager.userID}` : manager.displayInfo.nick;
            idText.text = `ID : ${manager.userID}`;

            const loader = item.asCom.getChild("loader").asLoader;
            CommonFunction.setHead(loader, manager.displayInfo.headIconURL);

            const removeBtn = item.asCom.getChild("removeBtn").asButton;

            removeBtn.offClick(this.onRemoveBtnClick, this);
            removeBtn.onClick(this.onRemoveBtnClick, this);
            removeBtn.data = manager;

        }
    }

    private loadMember(): void {
        //
        const tk = DataStore.getString("token", "");
        const loadMemberUrl = `${LEnv.rootURL}${LEnv.loadClubMembers}?&tk=${tk}&clubID=${this.clubInfo.baseInfo.clubID} `;

        const cb = (xhr: XMLHttpRequest, err: string) => {
            //
            const data = <Uint8Array>xhr.response;
            const msgClubReply = proto.club.MsgClubReply.decode(data);
            if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCOperation) {
                const reply = proto.club.MsgClubLoadMembersReply.decode(msgClubReply.content);
                const members = reply.members;
                this.updateMemberList(members);
            }
        };

        this.clubRequest(loadMemberUrl, cb);

    }
    private removeManager(manager: proto.club.IMsgClubMemberInfo): void {
        //
        const index = this.managers.indexOf(manager);
        this.managers.splice(index, 1);
        this.managerList.numItems = 2;
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
                this.changeManager(rspMember, member);
            } else if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCError) {
                const msgCubOperGenericReply = proto.club.MsgCubOperGenericReply.decode(msgClubReply.content);
                if (msgCubOperGenericReply.errorCode !== proto.club.ClubOperError.CERR_OK) {
                    ClubRequestError.showErrMsg(msgCubOperGenericReply.errorCode);
                }
            }

        };

        this.clubRequest(url, cb);
    }

    private changeManager(member: proto.club.IMsgClubMemberInfo, oldMember: proto.club.IMsgClubMemberInfo): void {
        //

        this.saveMember(member, oldMember);

        if (oldMember.role === proto.club.ClubRoleType.CRoleTypeMgr) {
            this.clubInfo.managers.push(member.userID);
            this.view.getController("view").selectedIndex = 0;
            this.loadClubMgrs();
            //this.removeMember(member);
        } else {
            const index = this.clubInfo.managers.indexOf(member.userID);
            this.clubInfo.managers.splice(index, 1);
            this.removeManager(member);
        }

    }

    /**
     * 只覆盖属性，对象不变
     * @param member 返回来的新对象
     */
    private saveMember(member: proto.club.IMsgClubMemberInfo, oldMember: proto.club.IMsgClubMemberInfo): void {
        oldMember.allowCreateRoom = member.allowCreateRoom;
        oldMember.displayInfo = member.displayInfo;
        oldMember.online = member.online;
        oldMember.role = member.role;
        oldMember.userID = member.userID;
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
