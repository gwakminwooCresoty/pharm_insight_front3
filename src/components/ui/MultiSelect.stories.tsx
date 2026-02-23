import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import MultiSelect from './MultiSelect';
import DateRangePicker from './DateRangePicker';
import Button from './Button';

const STORE_OPTIONS = [
  { value: 'STORE-001', label: '강남점' },
  { value: 'STORE-002', label: '서초점' },
  { value: 'STORE-003', label: '송파점' },
  { value: 'STORE-004', label: '마포점' },
  { value: 'STORE-005', label: '종로점' },
];

const CARD_OPTIONS = [
  { value: 'samsung', label: '삼성카드' },
  { value: 'bc',      label: 'BC카드' },
  { value: 'hyundai', label: '현대카드' },
  { value: 'shinhan', label: '신한카드' },
];

const meta = {
  title: 'UI/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 (미선택)',
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    return (
      <MultiSelect
        label="매장"
        options={STORE_OPTIONS}
        selected={selected}
        onChange={setSelected}
        placeholder="매장 선택"
      />
    );
  },
};

export const AllSelected: Story = {
  name: '전체 선택 상태',
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(
      STORE_OPTIONS.map((o) => o.value),
    );
    return (
      <MultiSelect
        label="매장"
        options={STORE_OPTIONS}
        selected={selected}
        onChange={setSelected}
        placeholder="매장 선택"
      />
    );
  },
};

export const PartialSelection: Story = {
  name: '일부 선택 상태',
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['STORE-001', 'STORE-002']);
    return (
      <MultiSelect
        label="매장"
        options={STORE_OPTIONS}
        selected={selected}
        onChange={setSelected}
        placeholder="매장 선택"
      />
    );
  },
};

export const CardOptions: Story = {
  name: '카드사 선택',
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    return (
      <MultiSelect
        label="카드사"
        options={CARD_OPTIONS}
        selected={selected}
        onChange={setSelected}
        placeholder="카드사 선택"
      />
    );
  },
};

export const InFilterRow: Story = {
  name: '필터바 배치 예시',
  render: () => {
    const [stores, setStores]   = React.useState<string[]>([]);
    const [start, setStart]     = React.useState('2025-01-01');
    const [end, setEnd]         = React.useState('2025-01-31');
    return (
      <div className="flex items-end gap-4 bg-white px-6 py-3 rounded-lg border border-gray-100 shadow-sm">
        <DateRangePicker
          label="조회 기간"
          startDate={start}
          endDate={end}
          onStartChange={setStart}
          onEndChange={setEnd}
        />
        <MultiSelect
          label="매장"
          options={STORE_OPTIONS}
          selected={stores}
          onChange={setStores}
          placeholder="매장 선택"
        />
        <Button>조회</Button>
      </div>
    );
  },
  parameters: { layout: 'padded' },
};
