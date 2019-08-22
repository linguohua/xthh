/**
 * 经纬度两点距离计算
 */
export namespace GpsDistance {
    const rad = (d: number): number => {
        return d * Math.PI / 180;
    };

    export const calculateDistance = (latitude1: number, longitude1: number, latitude2: number, longitude2: number): number => {
        if (latitude1 === null || longitude1 === null || latitude2 === null || longitude2 === null) {
            return 0;
        }

        const earthRadius = 6378137;  // 赤道半径(单位m)
        let radLat1 = rad(latitude1);
        let radLat2 = rad(latitude2);
        let radLon1 = rad(longitude1);
        let radLon2 = rad(longitude2);

        if (radLat1 < 0) {
            radLat1 = Math.PI / 2 + Math.abs(radLat1); // south
        }

        if (radLat1 > 0) {
            radLat1 = Math.PI / 2 - Math.abs(radLat1); // north
        }

        if (radLon1 < 0) {
            radLon1 = Math.PI * 2 - Math.abs(radLon1); // west
        }

        if (radLat2 < 0) {
            radLat2 = Math.PI / 2 + Math.abs(radLat2); // south
        }

        if (radLat2 > 0) {
            radLat2 = Math.PI / 2 - Math.abs(radLat2); // north
        }

        if (radLon2 < 0) {
            radLon2 = Math.PI * 2 - Math.abs(radLon2); // west
        }

        const x1 = earthRadius * Math.cos(radLon1) * Math.sin(radLat1);
        const y1 = earthRadius * Math.sin(radLon1) * Math.sin(radLat1);
        const z1 = earthRadius * Math.cos(radLat1);

        const x2 = earthRadius * Math.cos(radLon2) * Math.sin(radLat2);
        const y2 = earthRadius * Math.sin(radLon2) * Math.sin(radLat2);
        const z2 = earthRadius * Math.cos(radLat2);

        const d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));

        //余弦定理求夹角
        const theta = Math.acos((earthRadius * earthRadius + earthRadius * earthRadius - d * d) / (earthRadius * earthRadius * 2));

        return Math.ceil(theta * earthRadius);
    };
}
