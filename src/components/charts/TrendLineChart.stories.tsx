import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import TrendLineChart from './TrendLineChart';
import {
  DUMMY_TREND_HOUR,
  DUMMY_TREND_DATE,
  DUMMY_TREND_WEEKDAY,
  DUMMY_TREND_PERIOD,
} from '@/data/pos.dummy';

const meta = {
  title: 'Charts/TrendLineChart',
  component: TrendLineChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TrendLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HourlyView: Story = {
  name: '시간대별 (9~21시)',
  args: { data: DUMMY_TREND_HOUR, showCompare: false },
};

export const HourlyWithCompare: Story = {
  name: '시간대별 + 비교기간 라인',
  args: { data: DUMMY_TREND_HOUR, showCompare: true },
};

export const DateView: Story = {
  name: '일별 (30일)',
  args: { data: DUMMY_TREND_DATE, showCompare: false },
};

export const DateWithCompare: Story = {
  name: '일별 + 비교기간 라인',
  args: { data: DUMMY_TREND_DATE, showCompare: true },
};

export const WeekdayView: Story = {
  name: '요일별 (월~일)',
  args: { data: DUMMY_TREND_WEEKDAY, showCompare: false },
};

export const PeriodView: Story = {
  name: '기간별',
  args: { data: DUMMY_TREND_PERIOD, showCompare: false },
};
