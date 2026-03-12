'use client';

import { Modal, Upload, Button, Tag, App } from 'antd';
import { InboxOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserIdentity } from '@/types/user';
import { useVerifyIdentity } from '@/hooks/query/useUser';

interface ModalIdentityCardProps {
    open: boolean;
    onClose: () => void;
    identity?: UserIdentity;
}

export default function ModalIdentityCard({ open, onClose, identity }: ModalIdentityCardProps) {
    const t = useTranslations('Profile.account');
    const { message } = App.useApp();
    const { mutateAsync: verifyIdentity } = useVerifyIdentity();

    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [frontUrl, setFrontUrl] = useState<string | undefined>(undefined);
    const [backUrl, setBackUrl] = useState<string | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);

    const handleFrontUpload = (file: File) => {
        setFrontFile(file);
        setFrontUrl(URL.createObjectURL(file));
        return false;
    };

    const handleBackUpload = (file: File) => {
        setBackFile(file);
        setBackUrl(URL.createObjectURL(file));
        return false;
    };

    const handleSubmit = async () => {
        if (!frontFile) {
            message.warning(t('cccdFrontRequired'));
            return;
        }
        if (!backFile) {
            message.warning(t('cccdBackRequired'));
            return;
        }
        setSubmitting(true);
        try {
            await verifyIdentity({ identityCardFront: frontFile, identityCardBack: backFile });
            message.success(t('cccdUploadSuccess'));
            setFrontFile(null);
            setBackFile(null);
            onClose();
        } catch {
            message.error(t('cccdUploadFailed'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setFrontFile(null);
        setBackFile(null);
        setFrontUrl(undefined);
        setBackUrl(undefined);
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            title={
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-base">{t('cccdTitle')}</span>
                    {identity?.isVerified ? (
                        <Tag icon={<CheckCircleOutlined />} color="success">{t('verified')}</Tag>
                    ) : (
                        <Tag icon={<ClockCircleOutlined />} color="warning">{t('pendingVerification')}</Tag>
                    )}
                </div>
            }
            footer={[
                <Button key="cancel" size="large" onClick={handleClose}>
                    {t('cancel')}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={!frontFile || !backFile}
                >
                    {t('cccdUploadSubmit')}
                </Button>,
            ]}
            width={720}
            centered
        >
            <p className="text-sm text-gray-500 mb-4">{t('cccdSubtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Front */}
                <div>
                    <p className="text-sm font-medium mb-2 text-center">{t('cccdFront')}</p>
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <Upload
                            accept="image/jpeg,image/png,image/webp"
                            showUploadList={false}
                            beforeUpload={handleFrontUpload}
                            style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%' }}
                        >
                            <div className={`relative flex items-center justify-center w-full h-full rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${frontUrl ? 'border-transparent' : 'border-gray-300 bg-gray-100 hover:border-primary hover:bg-blue-50'}`}>
                                {frontUrl ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={frontUrl}
                                            alt={t('cccdFront')}
                                            className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                            <p className="text-white text-sm font-semibold">{t('cccdReplaceImage')}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-center px-4">
                                        <InboxOutlined className="text-4xl text-gray-400" />
                                        <p className="text-sm font-medium text-gray-600">{t('cccdUploadText')}</p>
                                        <p className="text-xs text-gray-400">{t('cccdUploadHint')}</p>
                                    </div>
                                )}
                            </div>
                        </Upload>
                    </div>
                </div>

                {/* Back */}
                <div>
                    <p className="text-sm font-medium mb-2 text-center">{t('cccdBack')}</p>
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <Upload
                            accept="image/jpeg,image/png,image/webp"
                            showUploadList={false}
                            beforeUpload={handleBackUpload}
                            style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%' }}
                        >
                            <div className={`relative flex items-center justify-center w-full h-full rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${backUrl ? 'border-transparent' : 'border-gray-300 bg-gray-100 hover:border-primary hover:bg-blue-50'}`}>
                                {backUrl ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={backUrl}
                                            alt={t('cccdBack')}
                                            className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                            <p className="text-white text-sm font-semibold">{t('cccdReplaceImage')}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-center px-4">
                                        <InboxOutlined className="text-4xl text-gray-400" />
                                        <p className="text-sm font-medium text-gray-600">{t('cccdUploadText')}</p>
                                        <p className="text-xs text-gray-400">{t('cccdUploadHint')}</p>
                                    </div>
                                )}
                            </div>
                        </Upload>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
