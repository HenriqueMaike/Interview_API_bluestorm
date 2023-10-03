import { useContext } from 'react'
import Link from 'next/link'
import styles from './styles.module.scss'
import { FiLogOut } from 'react-icons/fi'

import { AuthContext } from '../../contexts/AuthContext'

export function Header() {

    const { signOut } = useContext(AuthContext)

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <div>
                    <Link href="/dashboard"><h2>BLUESTORM</h2></Link>
                </div>
                <nav className={styles.menuNav}>
                    <Link href="/medicamento">Criar Medicamento</Link>
                    <button onClick={signOut}>
                        <FiLogOut color='#FFF' size={24} />
                    </button>
                </nav>
            </div>
        </header>
    )
}