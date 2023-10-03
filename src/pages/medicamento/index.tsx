import { FormEvent, useEffect, useState } from "react";
import styles from './styles.module.scss'
import { toast } from "react-toastify";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/Header";
import { setupAPIClient } from "@/services/api";
import { RiDeleteBin6Line } from "react-icons/ri";

interface manufacturerList {
    name: string;
}

interface manufacturerProps {
    manufacturersRequest: manufacturerList[];
}

export default function Home({ manufacturersRequest }: manufacturerProps) {

    const api = setupAPIClient();

    const [manufacturersData, setManufacturersData] = useState(manufacturersRequest || []);

    const [drug_name, setDrug_name] = useState('');
    const [units_per_package, setUnits_per_package] = useState('');
    const [issued_on, setIssued_on] = useState('');
    const [expires_on, setExpires_on] = useState('');
    const [manufacturers, setManufacturers] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);

    async function handleMedicamentos(event: FormEvent) {
        event.preventDefault();

        try {

            if (drug_name === "" || units_per_package === "" || issued_on === "" || expires_on === "" || manufacturers.length === 0) {
                toast.error("Todos os campos devem ser preenchidos");
                return;
            }
            if (expires_on <= issued_on) {
                toast.error("Data de expiração dever ser maior que da fabricação");
                return;
            }

            let valueNumber = Number(units_per_package);

            if (valueNumber <= 0) {
                toast.error("Unidades por pacote não pode ser menor que 1");
                return;
            }

            if (drug_name.length > 30) {
                toast.error("Nome do medicamento deve ser menor que 30 caracteres");
                return;
            }

            let totalCaracteres = 0;

            for (let i = 0; i < manufacturers.length; i++) {
                totalCaracteres += manufacturers[i].length;
            }

            if (totalCaracteres > 50) {
                toast.error("Nome dos fabricantes devem ser menores que 50 caracteres");
                return;
            }

            let dataFormatadaIssued_on = new Date(issued_on).toISOString();
            let dataFormatadaExpires_on = new Date(expires_on).toISOString();

            const response = await api.post('/medications', {
                drug_name: drug_name,
                units_per_package: valueNumber,
                issued_on: dataFormatadaIssued_on,
                expires_on: dataFormatadaExpires_on,
                manufacturers: manufacturers,
            })

            toast.success(response.data.message);

            setDrug_name('')
            setDrug_name('');
            setUnits_per_package('');
            setIssued_on('');
            setExpires_on('');
            setManufacturers([]);

        } catch (error) {
            toast.error(error.message);
        }


    }

    function handleChangeManufacturers(e) {
        const selectedValue = e.target.value;
        if (selectedValue !== "") {
            if (!manufacturers.includes(selectedValue)) {
                setManufacturers((item) => {
                    return [...item, selectedValue];
                });
            }
        }
    }

    function handleDelete(name) {
        setManufacturers((item) => {
            if (item.includes(name)) {
                return item.filter((value) => value !== name);
            }
            return item;
        });
    }


    return (
        <>
            <Header />
            <div className={styles.containerCenter}>
                <h2>CADASTRO DE MEDICAMENTOS</h2>
                <div className={styles.medicamentos}>

                    <form onSubmit={handleMedicamentos}>
                        <label>Nome do Medicamento: </label>
                        <Input
                            placeholder="Digite o Nome do Medicamento"
                            type='text'
                            value={drug_name}
                            onChange={(e) => setDrug_name(e.target.value)} />
                        <label>Unidades por Pacote: </label>
                        <Input
                            placeholder="Digite Unidades por Pacote"
                            type='number'
                            value={units_per_package}
                            onChange={(e) => setUnits_per_package(e.target.value)} />

                        <label>Data de produção: </label>
                        <Input
                            placeholder="Digite a data de produção"
                            type='date'
                            value={issued_on}
                            onChange={(e) => setIssued_on(e.target.value)} />

                        <label>Data de Vencimento: </label>
                        <Input
                            placeholder="Digite a data de vencimento"
                            type='date'
                            value={expires_on}
                            onChange={(e) => setExpires_on(e.target.value)} />

                        <label>Selecione o Fabricantes: </label>
                        <Select
                            onChange={handleChangeManufacturers}
                        >
                            <option></option>
                            {manufacturersData.map((item, index) => {
                                return (
                                    <option key={index} value={item.name}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </Select>

                        <label>Fabricantes selecionado(s): </label><br />

                        {manufacturers.map((item, index) => {
                            return (
                                <section key={index} className={styles.delete}>
                                    <p>{item}</p>
                                    <button onClick={() => handleDelete(item)}><RiDeleteBin6Line /></button>
                                </section>
                            )
                        })}


                        <Button
                            type='submit'
                            loading={loading}
                        >
                            CADASTRAR
                        </Button>

                    </form>

                </div>
            </div>

        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const api = setupAPIClient(ctx);

    const response = await api.get('/manufacturers');

    return {
        props: {
            manufacturersRequest: response.data.data
        }
    }
})