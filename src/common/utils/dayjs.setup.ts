import * as dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/tr';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsLocaleData from 'dayjs/plugin/localeData';
import utc from 'dayjs/plugin/utc';
import dayjsWeekday from 'dayjs/plugin/weekday';

dayjs.extend(dayjsDuration);
dayjs.extend(dayjsWeekday);
dayjs.extend(dayjsLocaleData);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
