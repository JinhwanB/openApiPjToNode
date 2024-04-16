const request = require('request');

async function getOpenApi(start: number, end: number): Promise<object> {
  try {
    const url = `http://openapi.seoul.go.kr:8088/6a44486151796a6a39305858656443/json/TbPublicWifiInfo/${start}/${end}`;
    const response = await new Promise<{ response: object; body: string }>((resolve, reject) => {
      request(
        {
          url: url,
          method: 'GET',
        },
        function (err: object, response: object, body: string) {
          if (err) {
            reject(err);
          } else {
            resolve({ response, body });
          }
        }
      );
    });

    if ((response.response as any).statusCode === 200) {
      return JSON.parse(response.body);
    } else {
      throw new Error('api 불러오기 실패');
    }
  } catch (err) {
    console.error('api 호출 실패: ', err);
    throw err;
  }
}

module.exports = getOpenApi;
