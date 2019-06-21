/**
 *
 */

export interface ClubViewInterface {
    selectGame?: Function;
    disbandClub?: Function;
    modifyClubName?: Function;
    quitClub?: Function;
    addClub?: Function;
    delMember?: Function;

    showQuicklyCreateView?: Function;
    loadClubRooms?: Function;

}

export enum RoomType {
    ALL = 0,
    DFMJ = 1,
    ZJMJ = 21
}
