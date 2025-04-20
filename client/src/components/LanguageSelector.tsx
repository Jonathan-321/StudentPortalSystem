import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
  mobile?: boolean;
}

export default function LanguageSelector({ mobile = false }: LanguageSelectorProps) {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  if (mobile) {
    return (
      <div className="bg-primary-600 py-2 px-4 flex justify-end">
        <Select value={currentLanguage} onValueChange={changeLanguage}>
          <SelectTrigger className="bg-primary-600 text-white border-none w-auto focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder={t('Select language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="rw">Kinyarwanda</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
      <Select value={currentLanguage} onValueChange={changeLanguage}>
        <SelectTrigger className="w-full focus:ring-0">
          <SelectValue placeholder={t('Select language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="rw">Kinyarwanda</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
