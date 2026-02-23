import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import DateRangePicker from './DateRangePicker';
import Button from './Button';

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 (레이블 포함)',
  render: () => {
    const [start, setStart] = React.useState('2025-01-01');
    const [end, setEnd]     = React.useState('2025-01-31');
    return (
      <DateRangePicker
        label="조회 기간"
        startDate={start}
        endDate={end}
        onStartChange={setStart}
        onEndChange={setEnd}
      />
    );
  },
};

export const WithoutLabel: Story = {
  name: '레이블 없음',
  render: () => {
    const [start, setStart] = React.useState('2025-01-01');
    const [end, setEnd]     = React.useState('2025-01-31');
    return (
      <DateRangePicker
        startDate={start}
        endDate={end}
        onStartChange={setStart}
        onEndChange={setEnd}
      />
    );
  },
};

export const InFilterBar: Story = {
  name: '필터바 배치 예시',
  render: () => {
    const [start, setStart] = React.useState('2025-01-01');
    const [end, setEnd]     = React.useState('2025-01-31');
    return (
      <div className="flex items-end gap-4 bg-white px-6 py-3 rounded-lg border border-gray-100 shadow-sm">
        <DateRangePicker
          label="조회 기간"
          startDate={start}
          endDate={end}
          onStartChange={setStart}
          onEndChange={setEnd}
        />
        <Button>조회</Button>
        <div className="ml-auto">
          <Button variant="excel">엑셀 다운로드</Button>
        </div>
      </div>
    );
  },
  parameters: { layout: 'padded' },
};
