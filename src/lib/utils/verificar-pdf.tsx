import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { resolveImageUrl } from '@/src/lib/utils/utils';

interface Vaccine {
  id: string;
  type: string;
  aplication_date: string;
  months_validity: number;
  expiration_date: string;
  next_vaccine_date: string;
}

interface Owner {
  id: string;
  name: string;
  phone: string;
  address: string;
  dni: string;
}

interface ImageData {
  id: string;
  path_url: string;
}

interface PetData {
  id: string;
  identifier: string;
  name: string;
  species: string;
  race: string;
  gender: string;
  color: string;
  temperament: string;
  reproductive_condition: string;
  age: string;
  status: string;
  owner: Owner;
  images: ImageData[];
  vaccines: Vaccine[];
}

const vaccineTypeLabels: Record<string, string> = {
  rabia: "Antirrábica",
  parvovirus: "Parvovirus",
  moquillo: "Moquillo",
  polivalente: "Polivalente",
  leptospirosis: "Leptospirosis",
  bordetella: "Bordetella",
  influenza: "Influenza Canina",
  desparasitacion: "Desparasitación",
};

const colors = {
  primary: '#1a5276',
  text: '#2c3e50',
  muted: '#7f8c8d',
  light: '#eef2f7',
  border: '#dce1e8',
  white: '#ffffff',
  accent: '#228b22',
  destructive: '#e74c3c',
  warning: '#f39c12',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: colors.text,
  },
  banner: {
    width: '100%',
    height: 50,
    marginBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoMuni: { width: 150, height: 55 },
  logoAlcalde: { width: 95, height: 45 },
  logoGestion: { width: 110, height: 45 },
  titleBlock: {
    textAlign: 'center',
    marginBottom: 20,
  },
  titleSub: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 2,
  },
  titleMain: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 3,
  },
  titleId: {
    fontSize: 7,
    color: colors.muted,
    marginBottom: 2,
  },
  titleCode: {
    fontSize: 8,
    color: colors.accent,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  titleDate: {
    fontSize: 8,
    color: colors.muted,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    backgroundColor: colors.light,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  dimCardWrap: {
    alignItems: 'center',
    marginVertical: 8,
  },
  dimCard: {
    width: 242.64,
    height: 153.01,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  dimBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: -1,
  },
  dimMainRow: {
    flexDirection: 'row',
    marginTop: '21mm',
    paddingLeft: '4mm',
    paddingRight: '0mm',
    alignItems: 'flex-start',
  },
  dimPhotoBox: {
    width: '19mm',
    height: '25mm',
    marginRight: '2mm',
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  dimPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  dimInfo: {
    width: '37mm',
    flexDirection: 'column',
    paddingTop: 1,
  },
  dimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2.5,
  },
  dimLabel: {
    fontSize: 5,
    color: '#64748b',
    width: '11mm',
    marginRight: 0.5,
  },
  dimValue: {
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#2d3748',
    width: '25.5mm',
  },
  dimNameVal: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a202c',
    width: '25.5mm',
  },
  dimIdVal: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#228b22',
    width: '25.5mm',
  },
  dimQrWrap: {
    width: '15mm',
    alignItems: 'center',
    marginLeft: '3mm',
    marginTop: '1mm',
  },
  dimQrImg: {
    width: '15mm',
    height: '15mm',
  },
  dimQrText: {
    fontSize: 3.5,
    color: '#718096',
    textAlign: 'center',
    marginTop: 1,
  },
  dimPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerBlock: {
    marginBottom: 4,
  },
  ownerLabel: {
    fontSize: 7,
    color: colors.muted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ownerDetail: {
    fontSize: 9,
    color: colors.text,
    marginBottom: 2,
  },
  vaccineHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  vaccineHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.white,
  },
  vaccineRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  vaccineCell: {
    fontSize: 8,
    color: colors.text,
  },
  vaccineBadge: {
    fontSize: 7,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    textAlign: 'center' as const,
  },
  colType: { width: '30%' },
  colDate: { width: '25%' },
  colExp: { width: '25%' },
  colStatus: { width: '20%', alignItems: 'flex-end' as const },
  footer: {
    position: 'absolute' as const,
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: 7,
    color: colors.muted,
  },
});

function getVaccineStatusColor(v: Vaccine): string {
  if (!v.expiration_date) return colors.muted;
  const today = new Date();
  const exp = new Date(v.expiration_date);
  if (exp < today) return colors.destructive;
  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) return colors.warning;
  return colors.accent;
}

function getVaccineLabel(v: Vaccine): string {
  if (!v.expiration_date) return "Sin caducidad";
  const today = new Date();
  const exp = new Date(v.expiration_date);
  if (exp < today) return "Vencida";
  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) return `Vence en ${diffDays} días`;
  return "Vigente";
}

function formatDateShort(dateStr: string): string {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
}

const genderLabel: Record<string, string> = {
  macho: "Macho",
  hembra: "Hembra",
};

const speciesEmoji: Record<string, string> = {
  perro: "🐕",
  gato: "🐈",
};

const dimPlaceholderImg = '/images/dim/placeholder.png';

const truncate = (str: string, len: number) =>
  str && str.length > len ? str.substring(0, len) + '.' : str || '';

// eslint-disable-next-line jsx-a11y/alt-text
const DimCardEmbedded = ({
  data, photoUrl, qrDataUrl, bgUrl,
}: {
  data: PetData; photoUrl?: string; qrDataUrl: string; bgUrl: string;
}) => (
  <View style={styles.dimCard}>
    <Image src={bgUrl} style={styles.dimBackground} />
    <View style={styles.dimMainRow}>
      <View style={styles.dimPhotoBox}>
        {photoUrl ? (
          <Image src={photoUrl} style={styles.dimPhoto} />
        ) : (
          <View style={styles.dimPlaceholder}>
            <Text style={{ fontSize: 16 }}>
              {speciesEmoji[data.species?.toLowerCase()] || '🐾'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.dimInfo}>
        <View style={styles.dimRow}>
          <Text style={styles.dimLabel}>NOMBRE:</Text>
          <Text style={styles.dimNameVal}>{truncate(data.name.toUpperCase(), 14)}</Text>
        </View>
        <View style={styles.dimRow}>
          <Text style={styles.dimLabel}>CÓDIGO:</Text>
          <Text style={styles.dimIdVal}>{data.identifier}</Text>
        </View>
        <View style={styles.dimRow}>
          <Text style={styles.dimLabel}>ESPECIE:</Text>
          <Text style={styles.dimValue}>{truncate(data.species.toUpperCase(), 15)}</Text>
        </View>
        <View style={styles.dimRow}>
          <Text style={styles.dimLabel}>RAZA:</Text>
          <Text style={styles.dimValue}>{truncate(data.race.toUpperCase(), 16)}</Text>
        </View>
        <View style={styles.dimRow}>
          <Text style={styles.dimLabel}>SEXO:</Text>
          <Text style={styles.dimValue}>{truncate(genderLabel[data.gender?.toLowerCase()] || data.gender, 15)}</Text>
        </View>
        <View style={styles.dimRow}>
          <Text style={styles.dimLabel}>COLOR:</Text>
          <Text style={styles.dimValue}>{truncate(data.color.toUpperCase(), 15)}</Text>
        </View>
        <View style={styles.dimRow}>
          <Text style={styles.dimLabel}>TEMP..</Text>
          <Text style={styles.dimValue}>{truncate(data.temperament, 15)}</Text>
        </View>
      </View>
      <View style={styles.dimQrWrap}>
        {qrDataUrl && <Image src={qrDataUrl} style={styles.dimQrImg} />}
        <Text style={styles.dimQrText}>Escanea para</Text>
        <Text style={styles.dimQrText}>verificar</Text>
      </View>
    </View>
  </View>
);

// eslint-disable-next-line jsx-a11y/alt-text
const VerificarDocument = ({
  data, photoUrl, logoMuni, logoAlcalde, logoGestion, cintillo, qrDataUrl, dimBg,
}: {
  data: PetData; photoUrl?: string; logoMuni: string; logoAlcalde: string;
  logoGestion: string; cintillo: string; qrDataUrl: string; dimBg: string;
}) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.logoRow}>
          <Image src={logoMuni} style={styles.logoMuni} />
        </View>
        
        <View style={styles.titleBlock}>
          <Text style={styles.titleSub}>MUNICIPALIDAD DISTRITAL</Text>
          <Text style={styles.titleMain}>ANDRÉS AVELINO CÁCERES DORREGARAY</Text>
          <Text style={styles.titleId}>DOCUMENTO DE IDENTIDAD DE MASCOTA</Text>
          <Text style={styles.titleCode}>Código: {data.identifier}</Text>
          <Text style={styles.titleDate}>Fecha de emisión: {dateStr}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>TARJETA DE IDENTIDAD (DIM)</Text>

        <View style={styles.dimCardWrap}>
          <DimCardEmbedded
            data={data}
            photoUrl={photoUrl}
            qrDataUrl={qrDataUrl}
            bgUrl={dimBg}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>DATOS DEL PROPIETARIO</Text>
        <View style={styles.ownerBlock}>
          <Text style={styles.ownerLabel}>Nombre</Text>
          <Text style={styles.ownerName}>{data.owner?.name || "No registrado"}</Text>
          {data.owner?.dni && <Text style={styles.ownerDetail}>DNI: {data.owner.dni}</Text>}
          {data.owner?.phone && <Text style={styles.ownerDetail}>Teléfono: {data.owner.phone}</Text>}
          {data.owner?.address && <Text style={styles.ownerDetail}>Dirección: {data.owner.address}</Text>}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>REGISTRO DE VACUNAS</Text>
        {data.vaccines?.length > 0 ? (
          <View>
            <View style={styles.vaccineHeader}>
              <View style={styles.colType}><Text style={styles.vaccineHeaderCell}>Vacuna</Text></View>
              <View style={styles.colDate}><Text style={styles.vaccineHeaderCell}>Fecha Aplicación</Text></View>
              <View style={styles.colExp}><Text style={styles.vaccineHeaderCell}>Vencimiento</Text></View>
              <View style={styles.colStatus}><Text style={styles.vaccineHeaderCell}>Estado</Text></View>
            </View>
            {data.vaccines.map((v) => (
              <View key={v.id} style={styles.vaccineRow}>
                <View style={styles.colType}>
                  <Text style={styles.vaccineCell}>{vaccineTypeLabels[v.type?.toLowerCase()] || v.type}</Text>
                </View>
                <View style={styles.colDate}>
                  <Text style={styles.vaccineCell}>{formatDateShort(v.aplication_date)}</Text>
                </View>
                <View style={styles.colExp}>
                  <Text style={styles.vaccineCell}>{v.expiration_date ? formatDateShort(v.expiration_date) : '—'}</Text>
                </View>
                <View style={styles.colStatus}>
                  <View style={[styles.vaccineBadge, { backgroundColor: getVaccineStatusColor(v) + '20' }]}>
                    <Text style={{ color: getVaccineStatusColor(v) }}>{getVaccineLabel(v)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 8, color: colors.muted, textAlign: 'center', marginTop: 10 }}>
            Sin vacunas registradas
          </Text>
        )}

        <View style={styles.footer}>
          <Image src={cintillo} style={styles.banner} />
        </View>
        
      </Page>
    </Document>
  );
};

async function imageToBase64(url: string): Promise<string> {
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

export const generateVerificarPDF = async (data: PetData): Promise<void> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const [logoMuni, logoAlcalde, logoGestion, cintillo, dimBg] = await Promise.all([
      imageToBase64(`${baseUrl}/images/landing/logo-muni.webp`),
      imageToBase64(`${baseUrl}/images/landing/logo-alcalde.webp`),
      imageToBase64(`${baseUrl}/images/landing/logo-gestion.webp`),
      imageToBase64(`${baseUrl}/images/landing/CINTILLO.webp`),
      imageToBase64(`${baseUrl}/images/dim/dim-base.png`),
    ]);

    let photoUrl: string | undefined;
    const rawUrl = resolveImageUrl(data.images?.[0]?.path_url);
    if (rawUrl) {
      try { photoUrl = await imageToBase64(rawUrl); }
      catch { photoUrl = undefined; }
    }

    const verifyUrl = `${baseUrl}/verificar?id=${data.identifier}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 0,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'L',
    });

    const blob = await pdf(
      <VerificarDocument
        data={data}
        photoUrl={photoUrl}
        logoMuni={logoMuni}
        logoAlcalde={logoAlcalde}
        logoGestion={logoGestion}
        cintillo={cintillo}
        qrDataUrl={qrDataUrl}
        dimBg={dimBg}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificado_${data.identifier}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating verificar PDF:', error);
    throw error;
  }
};
