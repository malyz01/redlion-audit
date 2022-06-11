import Stack from '@mui/material/Stack';
import Image from 'next/image';

export const Logo = () => {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ fontWeight: '800', fontSize: '20px' }}>
      <Image src="/assets/images/RedLion.svg" width={55} height={55} alt="Logo" />
      <div>Audit</div>
    </Stack>
  );
};
