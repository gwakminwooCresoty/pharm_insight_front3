import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import PaymentDonutChart from './PaymentDonutChart';
import { DUMMY_SETTLEMENT } from '@/data/settlement.dummy';

const meta = {
  title: 'Charts/PaymentDonutChart',
  component: PaymentDonutChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PaymentDonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '4개 결제수단',
  args: { breakdown: DUMMY_SETTLEMENT.breakdown },
};

export const TwoPaymentTypes: Story = {
  name: '2개 결제수단 (카드·현금)',
  args: {
    breakdown: [
      { paymentName: '카드', sales: 98000000, count: 2100, ratio: 0.72 },
      { paymentName: '현금', sales: 38000000, count: 820,  ratio: 0.28 },
    ],
  },
};

export const SinglePaymentType: Story = {
  name: '1개 결제수단 (엣지 케이스)',
  args: {
    breakdown: [
      { paymentName: '카드', sales: 136000000, count: 2920, ratio: 1.0 },
    ],
  },
};
