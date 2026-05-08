import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'ftlxjzrbxwkmasktlvix.supabase.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.vietqr.io',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'vietqr.net',
                port: '',
                pathname: '/**',
            },
        ],
        domains: ["example.com"],
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
