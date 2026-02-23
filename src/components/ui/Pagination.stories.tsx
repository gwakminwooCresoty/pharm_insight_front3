import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import Pagination from './Pagination';

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 (첫 페이지)',
  render: () => {
    const [page, setPage] = React.useState(0);
    return (
      <Pagination
        page={page}
        totalPages={10}
        totalElements={100}
        size={10}
        onPageChange={setPage}
      />
    );
  },
};

export const MiddlePage: Story = {
  name: '중간 페이지 (5/10)',
  render: () => {
    const [page, setPage] = React.useState(4);
    return (
      <Pagination
        page={page}
        totalPages={10}
        totalElements={100}
        size={10}
        onPageChange={setPage}
      />
    );
  },
};

export const LastPage: Story = {
  name: '마지막 페이지',
  render: () => {
    const [page, setPage] = React.useState(9);
    return (
      <Pagination
        page={page}
        totalPages={10}
        totalElements={100}
        size={10}
        onPageChange={setPage}
      />
    );
  },
};

export const LargeDataset: Story = {
  name: '대용량 데이터셋 (1000건)',
  render: () => {
    const [page, setPage] = React.useState(0);
    return (
      <Pagination
        page={page}
        totalPages={50}
        totalElements={1000}
        size={20}
        onPageChange={setPage}
      />
    );
  },
};
