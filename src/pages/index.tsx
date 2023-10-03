import { FormEvent, useContext, useState } from "react";
import styles from '../../styles/home.module.scss';
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/Button'
import { AuthContext } from "../contexts/AuthContext";
import { canSSRGuest } from "../utils/canSSRGuest";
import { toast } from "react-toastify";
import Image from "next/image";

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (username === '' || password === '') {
      toast.warning("Preecha todos os dados")
      return;
    }

    setLoading(true);

    let data = {
      username,
      password
    }

    await signIn(data)

    setLoading(false);
  }

  return (
    <>
      <div className={styles.containerCenter}>
        <Image src="/logo.jpg" width={400} height={200} alt="Logo bluestorm" />
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder="Digite seu nome de usuario"
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)} />

            <Input
              placeholder="Digite sua senha"
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)} />

            <Button
              type='submit'
              loading={loading}
            >
              Acessar
            </Button>

          </form>

        </div>
      </div>

    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})