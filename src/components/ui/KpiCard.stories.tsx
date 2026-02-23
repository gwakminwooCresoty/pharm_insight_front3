import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { TrendingUp, Users, ShoppingCart, Store } from 'lucide-react';
import KpiCard from './KpiCard';

const meta = {
  title: 'UI/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: '매출액',
    value: '152,000,000원',
  },
};

export const WithPositiveRatio: Story = {
  name: '전월 대비 상승 (▲)',
  args: {
    label: '매출액',
    value: '152,000,000원',
    compareRatio: 5.2,
    subLabel: '전월 대비',
    icon: <TrendingUp size={15} />,
  },
};

export const WithNegativeRatio: Story = {
  name: '전월 대비 하락 (▼)',
  args: {
    label: '매출액',
    value: '148,000,000원',
    compareRatio: -3.1,
    subLabel: '전월 대비',
    icon: <TrendingUp size={15} />,
  },
};

export const ZeroRatio: Story = {
  name: '변동 없음 (0%)',
  args: {
    label: '매출액',
    value: '150,000,000원',
    compareRatio: 0,
    subLabel: '전월 대비',
  },
};

export const WithIcon: Story = {
  name: '아이콘 포함',
  args: {
    label: '방문 고객',
    value: '3,120명',
    compareRatio: 2.8,
    subLabel: '전월 대비',
    icon: <Users size={15} />,
  },
};

export const FourKpiRow: Story = {
  name: '4개 KPI 행 — 실제 대시보드 배치',
  render: () => (
    <div className="grid grid-cols-4 gap-4 w-full">
      <KpiCard
        label="매출액"
        value="152,000,000원"
        compareRatio={5.2}
        subLabel="전월 대비"
        icon={<TrendingUp size={15} />}
      />
      <KpiCard
        label="방문 고객"
        value="3,120명"
        compareRatio={2.8}
        subLabel="전월 대비"
        icon={<Users size={15} />}
      />
      <KpiCard
        label="객단가"
        value="48,717원"
        compareRatio={-1.2}
        subLabel="전월 대비"
        icon={<ShoppingCart size={15} />}
      />
      <KpiCard
        label="운영 매장"
        value="48개"
        compareRatio={0}
        subLabel="변동 없음"
        icon={<Store size={15} />}
      />
    </div>
  ),
};
