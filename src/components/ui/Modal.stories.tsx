import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { fn } from 'storybook/test';
import Modal from './Modal';
import Button from './Button';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onClose: fn() },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 (md)',
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} title="매장 정보">
          <p className="text-sm text-gray-700">
            강남점의 기본 정보를 조회합니다. 주소, 운영 시간, 담당자 정보를 확인하세요.
          </p>
        </Modal>
      </>
    );
  },
};

export const SizeSm: Story = {
  name: '소형 (sm) — 확인 다이얼로그',
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>삭제</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} title="삭제 확인" size="sm">
          <p className="text-sm text-gray-700 mb-4">
            해당 프랜차이즈를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>취소</Button>
            <Button variant="danger" size="sm">삭제</Button>
          </div>
        </Modal>
      </>
    );
  },
};

export const SizeLg: Story = {
  name: '대형 (lg) — 사용자 초대 폼',
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>+ 사용자 초대</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} title="사용자 초대" size="lg">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                placeholder="user@example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">역할</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>프랜차이즈 관리자</option>
                <option>프랜차이즈 열람자</option>
                <option>지역 관리자</option>
                <option>매장 관리자</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>취소</Button>
              <Button>초대 전송</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const AlwaysOpen: Story = {
  name: '항상 열린 상태 (docs 스크린샷용)',
  args: {
    open: true,
    title: '매장 상세 정보',
    children: (
      <div className="text-sm text-gray-700 space-y-2">
        <p>매장명: 강남점</p>
        <p>주소: 서울시 강남구 테헤란로 123</p>
        <p>전화: 02-1234-5678</p>
      </div>
    ),
  },
};
