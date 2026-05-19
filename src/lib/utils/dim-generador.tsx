import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import type { Mascota } from '@/src/features/vet-dashboard/mascotas/types';

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

const MascotaCard = ({ data, qrDataUrl, bgUrl }: { data: Mascota, qrDataUrl: string, bgUrl: string }) => {
  const truncate = (str: string, len: number) => str.length > len ? str.substring(0, len) + '.' : str;

  return (
    <Document>
      <Page size={[242.64, 153.01]} style={styles.page}>
        <Image src={bgUrl} style={styles.background} />

        <View style={styles.mainContainer}>
          <View style={styles.photoContainer}>
            <Image src="/placeholder.png" style={styles.photo} />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.row}>
                <Text style={styles.label}>NOMBRE:</Text>
                <Text style={styles.nameValue}>{truncate(data.name.toUpperCase(), 14)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>CÓDIGO:</Text>
                <Text style={styles.idValue}>{data.id}</Text>
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
                <Text style={styles.label}>EDAD:</Text>
                <Text style={styles.value}>{data.years}a {data.months}m</Text>
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
    const textoQR = `
      DOCUMENTO DE IDENTIDAD DE MASCOTA

      NOMBRE: ${data.name.toUpperCase()}
      IDENTIFICADOR: ${data.id}

      REGISTRO OFICIAL MUNICIPAL
      ANDRES AVELINO CACERES D.
      `;

    const qrDataUrl = await QRCode.toDataURL(textoQR, {
        margin: 0,
        color: { dark: '#000000', light: '#FFFFFF' },
        errorCorrectionLevel: 'L'
    });

    const bgUrl = '/images/dim/dim-base.png';

    const blob = await pdf(
      <MascotaCard data={data} qrDataUrl={qrDataUrl} bgUrl={bgUrl} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DIM_${data.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
