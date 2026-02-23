import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { fn } from 'storybook/test';
import { Search, Download, Plus } from 'lucide-react';
import Button from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost', 'excel'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: { onClick: fn(), children: '버튼' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: '조회', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: '취소', variant: 'secondary' },
};

export const Danger: Story = {
  args: { children: '삭제', variant: 'danger' },
};

export const Ghost: Story = {
  args: { children: '닫기', variant: 'ghost' },
};

export const Excel: Story = {
  args: { children: '엑셀 다운로드', variant: 'excel' },
};

export const SizeSm: Story = {
  name: '소형 (sm)',
  args: { children: '조회', size: 'sm' },
};

export const SizeLg: Story = {
  name: '대형 (lg)',
  args: { children: '조회', size: 'lg' },
};

export const Disabled: Story = {
  args: { children: '비활성', disabled: true },
};

export const WithSearchIcon: Story = {
  name: '아이콘 포함 — 조회',
  render: (args) => (
    <Button {...args}>
      <Search size={13} />
      조회
    </Button>
  ),
  args: { variant: 'primary' },
};

export const WithDownloadIcon: Story = {
  name: '아이콘 포함 — 엑셀',
  render: (args) => (
    <Button {...args} variant="excel">
      <Download size={13} />
      엑셀 다운로드
    </Button>
  ),
};

export const AllVariants: Story = {
  name: '모든 변형 한눈에',
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="excel">
        <Download size={13} />
        Excel
      </Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="primary" size="sm">
        <Plus size={13} />
        소형
      </Button>
      <Button variant="primary" size="lg">대형</Button>
    </div>
  ),
};
