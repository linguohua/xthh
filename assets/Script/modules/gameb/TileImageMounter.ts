import { AgariIndex } from "./AgariIndex";

/**
 * 牌的图片挂载
 */
export namespace TileImageMounter {
    export const mountTileImage = (btn: fgui.GComponent, tileID: number): void => {
        const artID = AgariIndex.tileId2ArtId(tileID);
        const m = `ui://lobby_mahjong/suit${artID}`;
        const num = btn.getChild("title").asLoader;
        num.url = m;
    };
    export const mountMeldEnableImage = (btn: fgui.GComponent, tileID: number, id: number): void => {
        mountTileImage(btn, tileID);
    };
}
