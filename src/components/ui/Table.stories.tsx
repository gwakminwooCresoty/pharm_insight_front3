import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { fn } from 'storybook/test';
import Table from './Table';
import Badge from './Badge';

type PharmItem = {
  id: string;
  name: string;
  category: 'OTC' | 'RX' | 'ETC';
  qty: number;
  sales: number;
};

const SAMPLE_ITEMS: PharmItem[] = [
  { id: 'ITEM001', name: '타이레놀 500mg',   category: 'OTC', qty: 1200, sales: 18000000 },
  { id: 'ITEM002', name: '부루펜 400mg',     category: 'OTC', qty: 980,  sales: 14700000 },
  { id: 'ITEM003', name: '아목시실린 250mg', category: 'RX',  qty: 540,  sales: 10800000 },
  { id: 'ITEM004', name: '박카스D',          category: 'ETC', qty: 2100, sales: 6300000  },
  { id: 'ITEM005', name: '비타민C 1000mg',   category: 'ETC', qty: 760,  sales: 5700000  },
];

const CATEGORY_COLOR: Record<PharmItem['category'], 'blue' | 'green' | 'gray'> = {
  OTC: 'blue',
  RX: 'green',
  ETC: 'gray',
};

const columns = [
  { key: 'id',       header: '품목코드' },
  { key: 'name',     header: '품목명' },
  {
    key: 'category',
    header: '분류',
    render: (row: PharmItem) => (
      <Badge color={CATEGORY_COLOR[row.category]}>{row.category}</Badge>
    ),
  },
  {
    key: 'qty',
    header: '수량',
    render: (row: PharmItem) => row.qty.toLocaleString(),
    className: 'text-right',
  },
  {
    key: 'sales',
    header: '매출액',
    render: (row: PharmItem) => row.sales.toLocaleString('ko-KR') + '원',
    className: 'text-right',
  },
];

const meta = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {
  name: '데이터 있음',
  render: () => (
    <Table<PharmItem>
      columns={columns}
      data={SAMPLE_ITEMS}
      rowKey={(row) => row.id}
    />
  ),
};

export const WithRowClick: Story = {
  name: '행 클릭 가능',
  render: () => (
    <Table<PharmItem>
      columns={columns}
      data={SAMPLE_ITEMS}
      rowKey={(row) => row.id}
      onRowClick={fn()}
    />
  ),
};

export const WithRowColor: Story = {
  name: '행 조건부 색상 — RX 강조',
  render: () => (
    <Table<PharmItem>
      columns={columns}
      data={SAMPLE_ITEMS}
      rowKey={(row) => row.id}
      rowClassName={(row) => (row.category === 'RX' ? 'bg-blue-50' : '')}
    />
  ),
};

export const EmptyState: Story = {
  name: '빈 상태 (기본 메시지)',
  render: () => (
    <Table<PharmItem>
      columns={columns}
      data={[]}
      rowKey={(row) => row.id}
    />
  ),
};

export const EmptyCustomMessage: Story = {
  name: '빈 상태 (커스텀 메시지)',
  render: () => (
    <Table<PharmItem>
      columns={columns}
      data={[]}
      rowKey={(row) => row.id}
      emptyMessage="조회 기간에 해당하는 품목이 없습니다."
    />
  ),
};
