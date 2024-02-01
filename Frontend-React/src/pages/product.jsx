import { Helmet } from 'react-helmet-async';

import { ProductView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Product | Minimal UI </title>
      </Helmet>

      <ProductView />
    </>
  );
}
