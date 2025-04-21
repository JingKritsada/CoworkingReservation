// 'use client';

// import { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
import Loading from '@/components/Loading';

export default function GlobalLoading() {
    // const pathname = usePathname();
    // const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     setLoading(true);

    //     const timer = setTimeout(() => {
    //         setLoading(false);
    //     }, 5000);

    //     return () => clearTimeout(timer);
    // }, [pathname]);

    // return loading ? <Loading /> : null;

    return <Loading />;
}
