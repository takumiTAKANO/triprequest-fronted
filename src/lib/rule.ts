import { AccommodationData, DailyAllowanceData, TrainData,  DocumentData, DeleteFile } from '../types';

// const KIE_SERVER_URL = 'http://cefiro.comp.ae.keio.ac.jp:8888';
const KIE_SERVER_URL = 'http://localhost:8888';

export function checkAccommodation(
  data: AccommodationData
): Promise<AccommodationData> {
  if (data.stayClass === '日帰り' || data.stayClass === '宿泊(帰着日)') {
    return Promise.resolve({
      ...data,
      accommodationAmount: 0,
      accommodationDescription: '宿泊がないため宿泊料は支給されません',
    });
  }
  return fetch(`${KIE_SERVER_URL}/accommodations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then((json: AccommodationData) => json);
}

export function checkDailyAllowance(
  data: DailyAllowanceData
): Promise<DailyAllowanceData> {
  return fetch(`${KIE_SERVER_URL}/dailyallowances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then((json: DailyAllowanceData) => json);
}

export function checkTrain(
  data: TrainData
): Promise<TrainData> {
  return fetch(`${KIE_SERVER_URL}/trains`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then((json: TrainData) => json);
}

export function exportExcel(
  data: DocumentData
): Promise<DocumentData> {
  return fetch(`${KIE_SERVER_URL}/excel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then((json: DocumentData) => json);
}

export function safeDelete(
  data: DeleteFile
): Promise<DeleteFile> {
  return fetch(`${KIE_SERVER_URL}/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then((json: DeleteFile) => json);
}