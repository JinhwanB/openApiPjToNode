const mariadb = require('mariadb');
const vals = require('./consts');

const pool = mariadb.createPool({
  host: vals.host,
  port: vals.port,
  user: vals.user,
  password: vals.password,
  database: 'openapi',
});

// db에 연결
const getConnection = async () => {
  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (err) {
    console.error('db 연결 실패: ', err);
    throw err;
  }
};

// db연결 해제
const releaseConnection = async (conn: any) => {
  try {
    await conn.release();
  } catch (err) {
    console.error('db 연결 해제 실패: ', err);
    throw err;
  }
};

const INSERT_WIFI_SQL =
  'insert into wifi(X_SWIFI_MGR_NO, X_SWIFI_WRDOFC, X_SWIFI_MAIN_NM, X_SWIFI_ADRES1, X_SWIFI_ADRES2, X_SWIFI_INSTL_FLOOR, X_SWIFI_INSTL_TY, X_SWIFI_INSTL_MBY, X_SWIFI_SVC_SE, X_SWIFI_CMCWR, X_SWIFI_CNSTC_YEAR, X_SWIFI_INOUT_DOOR, X_SWIFI_REMARS3, LAT, LNT, WORK_DTTM) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
const WIFI_TABLE_CNT_SQL = 'select count(*) from wifi';

// wifi 테이블 갯수 가져오기
const wifiTableCnt = async () => {
  let conn;
  try {
    conn = await getConnection();
    await conn.beginTransaction();
    const cnt = await conn.execute(WIFI_TABLE_CNT_SQL);
    releaseConnection(conn);
    return cnt;
  } catch (err) {
    console.error('wifi table count 실패: ', err);
    if (conn) {
      releaseConnection(conn);
    }
    throw err;
  }
};

// wifi 테이블에 저장
const insertWifi = async (jsonData: object[]) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.beginTransaction();
    for (const json of jsonData) {
      const values = Object.values(json);
      await conn.execute(INSERT_WIFI_SQL, values);
    }
    await conn.commit();
    releaseConnection(conn);
    return true;
  } catch (err) {
    console.error('wifi 저장 실패: ', err);
    if (conn) {
      conn.rollback();
      releaseConnection(conn);
    }
    throw err;
  }
};

module.exports = {
  insertWifi: insertWifi,
  wifiTableCnt: wifiTableCnt,
};
