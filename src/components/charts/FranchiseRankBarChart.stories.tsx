import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import FranchiseRankBarChart from './FranchiseRankBarChart';
import { DUMMY_FRANCHISES } from '@/data/platform.dummy';

const meta = {
  title: 'Charts/FranchiseRankBarChart',
  component: FranchiseRankBarChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FranchiseRankBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '전체 프랜차이즈 (상위 8개 표시)',
  args: { franchises: DUMMY_FRANCHISES },
};

export const TopFive: Story = {
  name: '상위 5개만',
  args: { franchises: DUMMY_FRANCHISES.slice(0, 5) },
};
