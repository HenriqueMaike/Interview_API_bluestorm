'apiCliente'
import { useEffect, useState } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import styles from './styles.module.scss';
import { Header } from '../../components/Header'
import { setupAPIClient } from '../../services/api';
import TablePagination from '@mui/material/TablePagination';
import { Input } from '@/components/ui/input';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';

interface medications {
  application_number: string;
  product_number: string;
  form: string;
  strength: string;
  reference_drug: string;
  drug_name: string;
  active_ingredient: string;
  reference_standard: string
};

export default function Dashboard() {

  const apiCliente = setupAPIClient()

  const [loading, setLoadind] = useState(true);

  const [dados, setDados] = useState<medications[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [search, setSearch] = useState("");
  const [pages, setPages] = useState();

  useEffect(() => {
    async function handleMedication() {
      if (search.length >= 3) {
        try {
          const response = await apiCliente.get('/medications', {
            params: {
              page: page + 1,
              limit: rowsPerPage,
              search: search,
            },
          });
          setDados(response.data.data);
          setPages(response.data.total)
          setLoadind(false)
        } catch (error) {
          console.error("Erro ao buscar medicamentos:", error);
        }
      } else {
        try {
          const response = await apiCliente.get('/medications', {
            params: {
              page: page + 1,
              limit: rowsPerPage,
            },
          });
          setDados(response.data.data);
          setPages(response.data.total)
          setLoadind(false)
        } catch (error) {
          toast.error("Erro ao buscar medicamentos:", error);
        }
      }
    }
    
    handleMedication();
  }, [page, rowsPerPage, search]);

  

  () => (event: React.MouseEvent<HTMLButtonElement> | null, search: string,) => {
    setSearch(search);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function defaultLabelDisplayedRows({ from, to, count }) {
    return `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`;
  }

  if (loading) {
    return (
      <div className={styles.progressContainer}>
        <div>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.containerChild}>
          <div className={styles.input}>
            <Input
              placeholder='Digite sua busca'
              value={search}
              onChange={(e) => (setSearch(e.target.value))}
            />
          </div>
          <div className={styles.dados}>
            {
              dados.map((medication, index) => (
                <div key={index} className={styles.cards}>
                  <p className={styles.drugName}><strong>Nome do Medicamento: <br /></strong>{medication.drug_name}</p>
                  <p><strong>Número da aplicação: </strong>{medication.application_number}</p>
                  <p><strong>Número do Produto: </strong>{medication.product_number}</p>
                  <p><strong>Forma: </strong>{medication.form}</p>
                  <p><strong>Concentração: </strong>{medication.strength}</p>
                  <p><strong>Medicamento de Referência: </strong>{medication.reference_drug}</p>
                  <p><strong>Ingrediente Ativo: </strong>{medication.active_ingredient}</p>
                  <p><strong>Padrão de Referência: </strong>{medication.reference_standard}</p>
                </div>
              ))
            }
          </div>
          <div className={styles.pagination}>
            <TablePagination
              component="div"
              count={pages}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 20, 50, 100]}
              labelRowsPerPage="Itens por pagina"
              labelDisplayedRows={defaultLabelDisplayedRows}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  return {
    props: {}
  };
});