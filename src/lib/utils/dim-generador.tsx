/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import type { Mascota } from '@/src/features/patients/types';
import { resolveImageUrl } from '@/src/lib/utils/utils';

const placeholderImg = '/images/dim/placeholder.png';

async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  const img = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  img.close();
  return canvas.toDataURL('image/png');
}

const styles = StyleSheet.create({
  page: {
    width: '85.6mm',
    height: '53.98mm',
    position: 'relative',
    fontFamily: 'Helvetica',
  },
  background: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: -1,
  },
  mainContainer: {
    flexDirection: 'row',
    marginTop: '21mm',
    paddingLeft: '4mm',
    paddingRight: '0mm',
    alignItems: 'flex-start',
  },
  photoContainer: {
    width: '19mm',
    height: '25mm',
    marginRight: '2mm',
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  infoContainer: {
    width: '37mm',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2.5,
  },
  label: {
    fontSize: 5,
    color: '#64748b',
    width: '11mm',
    marginRight: 0.5,
  },
  value: {
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#2d3748',
    width: '25.5mm',
  },
  nameValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a202c',
    width: '25.5mm',
  },
  idValue: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#228b22',
    width: '25.5mm',
  },
  qrContainer: {
    width: '15mm',
    alignItems: 'center',
    marginLeft: '3mm',
    marginTop: '1mm',
  },
  qrImage: {
    width: '15mm',
    height: '15mm',
  },
  qrText: {
    fontSize: 3.5,
    color: '#718096',
    textAlign: 'center',
    marginTop: 1,
  },
});

const MascotaCard = ({ data, qrDataUrl, bgUrl, photoUrl }: { data: Mascota, qrDataUrl: string, bgUrl: string, photoUrl?: string }) => {
  const truncate = (str: string, len: number) => str.length > len ? str.substring(0, len) + '.' : str;

  return (
    <Document>
      <Page size={[242.64, 153.01]} style={styles.page}>
        <Image src={bgUrl} style={styles.background} />

        <View style={styles.mainContainer}>
          <View style={styles.photoContainer}>
            <Image src={photoUrl || placeholderImg} style={styles.photo} />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>NOMBRE:</Text>
              <Text style={styles.nameValue}>{truncate(data.name.toUpperCase(), 14)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>CÓDIGO:</Text>
              <Text style={styles.idValue}>{data.identifier}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>ESPECIE:</Text>
              <Text style={styles.value}>{truncate(data.species.toUpperCase(), 15)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>RAZA:</Text>
              <Text style={styles.value}>{truncate(data.race.toUpperCase(), 16)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>SEXO:</Text>
              <Text style={styles.value}>{truncate(data.gender.toUpperCase(), 15)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>COLOR:</Text>
              <Text style={styles.value}>{truncate(data.color.toUpperCase(), 15)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>TEMP..</Text>
              <Text style={styles.value}>{data.temperament}</Text>
            </View>
          </View>

          <View style={styles.qrContainer}>
            {qrDataUrl && <Image src={qrDataUrl} style={styles.qrImage} />}
            <Text style={styles.qrText}>Escanea para</Text>
            <Text style={styles.qrText}>verificar</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const generateMascotaPDF = async (data: Mascota): Promise<void> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verificar?id=${data.identifier}`;

    const textoQR = verifyUrl;

    const qrDataUrl = await QRCode.toDataURL(textoQR, {
      margin: 0,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'L'
    });

    const bgUrl = '/images/dim/dim-base.png';

    let photoUrl: string | undefined;
    const rawUrl = resolveImageUrl(data.images?.[0]?.path_url);
    if (rawUrl) {
      try {
        photoUrl = await urlToBase64(rawUrl);
      } catch {
        photoUrl = undefined;
      }
    }

    const blob = await pdf(
      <MascotaCard data={data} qrDataUrl={qrDataUrl} bgUrl={bgUrl} photoUrl={photoUrl} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DIM_${data.identifier}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
