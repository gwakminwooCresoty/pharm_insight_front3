import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import PaymentStackBarChart from './PaymentStackBarChart';
import { DUMMY_SETTLEMENT } from '@/data/settlement.dummy';

const meta = {
  title: 'Charts/PaymentStackBarChart',
  component: PaymentStackBarChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PaymentStackBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '30일 추이',
  args: { dailyTrend: DUMMY_SETTLEMENT.dailyTrend },
};

export const SevenDayView: Story = {
  name: '7일 추이',
  args: { dailyTrend: DUMMY_SETTLEMENT.dailyTrend.slice(0, 7) },
};
