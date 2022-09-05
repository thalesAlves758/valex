import dayjs, { Dayjs } from 'dayjs';

function dateStringToDayjs(date: string): Dayjs {
  return dayjs(`01/${date}`);
}

export default dateStringToDayjs;
