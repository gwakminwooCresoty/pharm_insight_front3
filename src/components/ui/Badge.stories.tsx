import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import Badge from './Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    color: {
      control: 'select',
      options: ['green', 'orange', 'red', 'gray', 'blue', 'yellow'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = {
  args: { children: '활성', color: 'green' },
};

export const Orange: Story = {
  args: { children: '경고', color: 'orange' },
};

export const Red: Story = {
  args: { children: '정지', color: 'red' },
};

export const Gray: Story = {
  args: { children: '비활성', color: 'gray' },
};

export const Blue: Story = {
  args: { children: 'ACTIVE', color: 'blue' },
};

export const Yellow: Story = {
  args: { children: '주의', color: 'yellow' },
};

export const AllColors: Story = {
  name: '모든 색상 한눈에',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge color="green">활성</Badge>
      <Badge color="orange">경고</Badge>
      <Badge color="red">정지</Badge>
      <Badge color="gray">비활성</Badge>
      <Badge color="blue">ACTIVE</Badge>
      <Badge color="yellow">주의</Badge>
    </div>
  ),
};

export const StatusUsage: Story = {
  name: '실사용 예시 — 매장 상태',
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-sm">
        <span className="w-20 text-gray-600">강남점</span>
        <Badge color="green">운영중</Badge>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="w-20 text-gray-600">서초점</span>
        <Badge color="yellow">점검중</Badge>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="w-20 text-gray-600">송파점</span>
        <Badge color="red">정지</Badge>
      </div>
    </div>
  ),
};
