'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginButton from "../ui/LoginButton";

export default function Header() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleAddRecipe = () => {
        if (isClient) {
            router.push('/addRep');
        }
    };

    return (
        <>
            <header className="flex justify-between items-center bg-green-500 p-4 text-white">
                <h1 className="text-lg font-bold">나만의 레시피</h1>
                <div>
                    <button 
                        className="mr-4 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleAddRecipe}
                    >
                        레시피 추가
                    </button>
                    <LoginButton />
                </div>
            </header>
        </>
    );
}
