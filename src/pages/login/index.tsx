import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getJWTPayload, setCookies } from "@/utils/cookie";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function LoginPage() {
  const [initial, setInitial] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5067/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ initial, password })
      });

      if (response.ok) {
        const responeBody = await response.json();
        setCookies('token', responeBody.data.token);
        if (getJWTPayload('role') === 'admin') {
          router.push('/admin/users');
        } else {
          router.push('/');
        }
      } else if (response.status === 401) {
        const responeBody = await response.json();
        setErrorMessage(responeBody.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
    
  };

  return (
    <div className="w-full h-screen flex items-start" style={{ backgroundColor: '#F3F4FF' }}>
      <div className="relative w-1/2 h-full flex flex-col">
        <img src="/Andi_Hakim_Nasution_building.jpg" className="w-full h-full object-cover" />
      </div>

      <main className={`flex flex-col justify-center p-24 w-1/2 h-full ${inter.className}`}>
        <h1 className="text-4xl font-bold mb-12 text-[#263C92]">Proyeksi Beban Kerja Pendidikan</h1>

        <Card className="w-full max-w-xl">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-3xl text-[#2C3E50]">Login</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {errorMessage && <div className="text-red-500">{errorMessage}</div>}
              <div className="grid gap-2">
                <Label htmlFor="initial" className="text-xl text-[#525F7F]">Initial</Label>
                <Input id="initial" type="text" required value={initial} onChange={e => setInitial(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-xl text-[#525F7F]">Password</Label>
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full text-xl bg-[#4D44B5] hover:bg-[#4D54B5] hover:text-white">Login</Button>
            </CardFooter>
          </form>
        </Card>
      </main>

    </div>
  );
}