import *as qs from 'query-string';

const KEY = 'dev_ethsuMAWdSu9';

export const searchStation = (
  name: string
): Promise<Array<{ type: string; code: string; name: string }>> => {
  const queryString = qs.stringify({
    key: KEY,
    name,
  });
  const url = `https://api.ekispert.jp/v1/json/search/station/light?${queryString}`;

  return fetch(url, { referrerPolicy: 'no-referrer' })
    .then(res => res.json())
    .then(json =>
     
      (json.ResultSet.Point as Array<any>).map(p => ({
        type:
          typeof p.Station.Type !== 'object'
            ? p.Station.Type
            : p.Station.Type.text,
        code: p.Station.code,
        name: p.Station.Name,
      }))
  //   }
  // }
  );
};

export const searchRoute = (data: {
  from: string;
  to: string;
  date: string;
  time: string;
  searchType: string;
  priceType: string;
  sort: string;
  assignTeikiSerializeData: string;
  priority: string;
  transit: string;
}) => {
  const { from, to, date, time, searchType, priceType, sort, assignTeikiSerializeData,priority, transit } = data;
  // if (transit === '') {
  const detail = (priceType === "kippu" && priority==="")
  ?"T3221233232319:F332112112100:A23121141:"
  :(priceType ==="kippu" && priority =="plane")
  ?"T4221233232319:F332112212000:A23121141:"
  :(priceType === "ic" && priority ==="")
  ?"T3221233232319:F332112112200:A23121141:"
  :"T4221233232319:F332112212000:A23121141:"
  
  var queryString = (assignTeikiSerializeData === "null" && transit === "")
  ? qs.stringify({
    key: KEY,
    viaList: `${from}:${to}`,
    date: date.replace(/-/g, ''),
    time: time.replace(':', ''),
    searchType,
    sort,
    checkEngineVersion: false,
    conditionDetail:detail,
    answerCount: 20,
    searchCount: 20,
  })
  : (assignTeikiSerializeData === "null" && transit !== "")
  ? qs.stringify({
    key: KEY,
    viaList: `${from}:${transit}:${to}`,
    date: date.replace(/-/g, ''),
    time: time.replace(':', ''),
    searchType,
    sort,
    checkEngineVersion: false,
    conditionDetail:detail,
    answerCount: 20,
    searchCount: 20,
  })
  :  (assignTeikiSerializeData !== "null" && transit === "")
  ?qs.stringify({
    key: KEY,
    viaList: `${from}:${to}`,
    date: date.replace(/-/g, ''),
    time: time.replace(':', ''),
    searchType,
    sort,
    assignTeikiSerializeData,
    checkEngineVersion: false,
    conditionDetail:detail,
    answerCount: 20,
    searchCount: 20,
  })
  :qs.stringify({
    key: KEY,
    viaList: `${from}:${transit}:${to}`,
    date: date.replace(/-/g, ''),
    time: time.replace(':', ''),
    searchType,
    sort,
    assignTeikiSerializeData,
    checkEngineVersion: false,
    conditionDetail:detail,
    answerCount: 20,
    searchCount: 20,
  })
  ;

  // var queryString = (assignTeikiSerializeData === "null" && priceType === "kippu")
  //   ? qs.stringify({
  //     key: KEY,
  //     viaList: `${from}:${to}`,
  //     date: date.replace(/-/g, ''),
  //     time: time.replace(':', ''),
  //     searchType,
  //     sort,
  //     checkEngineVersion: false,
  //     //conditionDetail: "T3221233232319:F232112212000:A23121141:",
  //     //conditionDetail: "T3221233232319:F332112112000:A23121141:",
  //     conditionDetail: "T3221233232319:F332112112100:A23121141:",
  //     answerCount: 20,
  //     searchCount: 20,
  //   })
  //   : (assignTeikiSerializeData === "null" && priceType === "ic")
  //   ? qs.stringify({
  //     key: KEY,
  //     viaList: `${from}:${to}`,
  //     date: date.replace(/-/g, ''),
  //     time: time.replace(':', ''),
  //     searchType,
  //     sort,
  //     checkEngineVersion: false,
  //     conditionDetail: "T3221233232319:F332112112200:A23121141:",
  //     answerCount: 20,
  //     searchCount: 20,
  //   })
  //   : (assignTeikiSerializeData !== "null" && priceType === "kippu")
  //   ? qs.stringify({
  //     key: KEY,
  //     viaList: `${from}:${to}`,
  //     date: date.replace(/-/g, ''),
  //     time: time.replace(':', ''),
  //     searchType,
  //     sort,
  //     assignTeikiSerializeData,
  //     checkEngineVersion: false,
  //     // conditionDetail: "T3221233232319:F232112212000:A23121141:",
  //     //conditionDetail: "T3221233232319:F332112112000:A23121141:",
  //     conditionDetail: "T3221233232319:F332112112100:A23121141:",
  //     answerCount: 20,
  //     searchCount: 20,
  //   })
  //   : qs.stringify({
  //     key: KEY,
  //     viaList: `${from}:${to}`,
  //     date: date.replace(/-/g, ''),
  //     time: time.replace(':', ''),
  //     searchType,
  //     sort,
  //     assignTeikiSerializeData,
  //     checkEngineVersion: false,
  //     conditionDetail: "T3221233232319:F332112112200:A23121141:",
  //     answerCount: 20,
  //     searchCount: 20,
  //   })
  //   ;
  //  } else {
    // var queryString = assignTeikiSerializeData === "null"
    // ? qs.stringify({
    //   key: KEY,
    //   viaList: `${from}:${transit}:${to}`,
    //   date: date.replace(/-/g, ''),
    //   time: time.replace(':', ''),
    //   searchType,
    //   sort,
    //   checkEngineVersion: false,
    //   conditionDetail: "T3221233232319:F232112212000:A23121141:",
    //   answerCount: 20,
    //   searchCount: 20,
    // })
    // : qs.stringify({
    //   key: KEY,
    //   viaList: `${from}:${transit}:${to}`,
    //   date: date.replace(/-/g, ''),
    //   time: time.replace(':', ''),
    //   searchType,
    //   sort,
    //   assignTeikiSerializeData,
    //   checkEngineVersion: false,
    //   conditionDetail: "T3221233232319:F232112212000:A23121141:",
    //   answerCount: 20,
    //   searchCount: 20,
    // });
  //  }


  const url = `https://api.ekispert.jp/v1/json/search/course/extreme?${queryString}`;

  return fetch(url, { referrerPolicy: 'no-referrer' }).then(res => res.json());
};

export const getPass = (data: {
  from: string;
  to: string;
  sort: string;
  transit: string;
}) => {
  const { from, to, sort, transit } = data;
  var queryString = transit === ''
    ? qs.stringify({
      key: KEY,
      viaList: `${from}:${to}`,
      sort,
      answerCount: 5,
      searchCount: 20,
      time: "0700",
    })
    : qs.stringify({
      key: KEY,
      viaList: `${from}:${transit}:${to}`,
      sort,
      answerCount: 5,
      searchCount: 20,
      time: "0700",
    })
  const url = `https://api.ekispert.jp/v1/json/search/course/extreme?${queryString}`;

  return fetch(url, { referrerPolicy: 'no-referrer' }).then(res => res.json());
};