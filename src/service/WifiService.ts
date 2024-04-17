const getApi = require('../openApi/openApi');
const DB = require('../database/connect/mariaDBConn');

/**
 * api를 통해 와이파이 정보를 가져와 1000개씩 db에 저장
 * @returns 총 db에 저장한 갯수
 */
const loadWifiCnt = async () => {
  try {
    const wifiTableCnt = DB.wifiTableCnt();
    if (wifiTableCnt !== 0) {
      return -1;
    }

    const json = await getApi(0, 1);
    const totalCnt: number = json.TbPublicWifiInfo.list_total_count;
    const num: number = totalCnt / 1000;
    const last: number = totalCnt % 1000;

    let start: number, end: number;
    let cnt: number = 0;
    for (let i = 0; i <= num; i++) {
      start = 1 + i * 1000;
      end = (1 + i) * 1000;
      if (last > 0 && i === num) {
        end = start + last - 1;
      }

      const jsonDatas = await getApi(start, end);
      const row: object[] = jsonDatas.TbPublicWifiInfo.row;
      if (await DB.insertWifi(row)) cnt += row.length;
    }
    return cnt;
  } catch (err) {
    console.error('wifi 로드 실패: ', err);
  }
};

module.exports = loadWifiCnt;
