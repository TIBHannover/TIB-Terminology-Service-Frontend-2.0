import React from 'react'
import { Container, Grid, Box, Link } from '@material-ui/core'

function Footer () {
  return (
    <Box px={{ xs: 3, sm: 10 }} py={{ xs: 5, sm: 10 }} bgcolor="#f2f2f2">
      <Container maxWidth="lg">
        <Grid container spacing = {5}>
          <Grid item xs = {12} sm={4}>
            <Box borderBottom={1}>About the Service</Box>
            <Box>
              <Link href="/" color="inherit">
                  Imprint
              </Link>
            </Box>
            <Box>
              <Link href="/" color="inherit">
                  Terms of Use
              </Link>
            </Box>
            <Box>
              <Link href="/" color="inherit">
                  Privacy Policy
              </Link>
            </Box>
          </Grid>
          <Grid item xs = {12} sm={4}>
            <Box>Maintainer</Box>
            <Box>
              <img src= {'https://www.tib.eu/typo3conf/ext/tib_tmpl_bootstrap/Resources/Public/images/TIB_Logo_de.png'} alt="TIB logo" width="250"/>
            </Box>
          </Grid>
          <Grid item xs = {12} sm={4}>
            <Box>Funding</Box>
            <Box>
              <img src= {'https://terminology.nfdi4chem.de/img/dfg_logo.png'} alt="dfg logo" width="250"/>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer
