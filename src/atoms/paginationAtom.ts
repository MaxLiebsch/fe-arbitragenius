
import { ProductPagination } from '@/hooks/use-aznflips-products';
import { atom,  } from 'jotai';

export const paginationAtom = atom({page: 0, pageSize: 20} as ProductPagination);