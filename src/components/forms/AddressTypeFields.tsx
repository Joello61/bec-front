import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Home, Building2, Mail as MailIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui';

interface AddressTypeFormValues {
  quartier?: string;
  adresseLigne1?: string;
  adresseLigne2?: string;
  codePostal?: string;
}

interface AddressTypeFieldsProps<T extends AddressTypeFormValues> {
  addressType: 'african' | 'postal';
  watchPays: string | undefined;
  watchVille: string | undefined;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
  bannerVariant?: 'blue' | 'gray';
}

export default function AddressTypeFields<T extends AddressTypeFormValues>({
  addressType,
  watchPays,
  watchVille,
  register,
  errors,
  disabled = false,
  bannerVariant = 'blue',
}: AddressTypeFieldsProps<T>) {
  const bannerClasses = bannerVariant === 'blue'
    ? { box: 'bg-blue-50 border border-blue-200 rounded-lg p-4', text: 'text-sm text-blue-800' }
    : { box: 'bg-gray-50 border border-gray-200 rounded-lg p-4', text: 'text-sm text-gray-700' };
  return (
    <>
      {/* Format Afrique */}
      {addressType === 'african' && watchVille && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Input
            label="Quartier"
            type="text"
            placeholder="Ex: Bastos, Bonanjo"
            error={errors.quartier?.message as string | undefined}
            leftIcon={<Home className="w-5 h-5" />}
            {...register('quartier' as never)}
            required
            disabled={disabled}
          />
        </motion.div>
      )}

      {/* Format postal */}
      {addressType === 'postal' && watchVille && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <Input
            label="Adresse (ligne 1)"
            type="text"
            placeholder="Ex: 21 rue du Cher"
            error={errors.adresseLigne1?.message as string | undefined}
            leftIcon={<Home className="w-5 h-5" />}
            {...register('adresseLigne1' as never)}
            required
            disabled={disabled}
          />

          <Input
            label="Adresse (ligne 2)"
            type="text"
            placeholder="Ex: Appartement 3B (optionnel)"
            error={errors.adresseLigne2?.message as string | undefined}
            leftIcon={<Building2 className="w-5 h-5" />}
            {...register('adresseLigne2' as never)}
            disabled={disabled}
          />

          <Input
            label="Code postal"
            type="text"
            placeholder="Ex: 31100"
            error={errors.codePostal?.message as string | undefined}
            leftIcon={<MailIcon className="w-5 h-5" />}
            {...register('codePostal' as never)}
            required
            disabled={disabled}
          />
        </motion.div>
      )}

      {/* Info type d'adresse */}
      {watchPays && (
        <div className={bannerClasses.box}>
          <p className={bannerClasses.text}>
            {addressType === 'african' ? (
              <>
                <strong>Format Afrique :</strong> Indiquez votre quartier/localité.
              </>
            ) : (
              <>
                <strong>Format international :</strong> Adresse postale complète requise.
              </>
            )}
          </p>
        </div>
      )}
    </>
  );
}
