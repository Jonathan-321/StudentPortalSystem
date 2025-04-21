import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme, PRESET_THEMES } from "@/hooks/use-theme";
import { HexColorPicker } from "react-colorful";
import { 
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui";
import { CheckCircle, Paintbrush, Palette } from "lucide-react";

export default function ThemeCustomizer() {
  const { t } = useTranslation();
  const { theme, setTheme, applyPresetTheme, currentThemeName } = useTheme();
  
  const [activeColorType, setActiveColorType] = useState<'primary' | 'secondary' | 'accent'>('primary');
  const [tempColorValues, setTempColorValues] = useState({
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,
    mode: theme.mode
  });

  const handlePresetSelection = (presetName: keyof typeof PRESET_THEMES) => {
    applyPresetTheme(presetName);
    
    // Also update the temp values for the custom tab
    setTempColorValues({
      primary: PRESET_THEMES[presetName].primary,
      secondary: PRESET_THEMES[presetName].secondary,
      accent: PRESET_THEMES[presetName].accent,
      mode: PRESET_THEMES[presetName].mode
    });
  };

  const handleCustomColorChange = (color: string) => {
    setTempColorValues({
      ...tempColorValues,
      [activeColorType]: color
    });
  };

  const applyCustomTheme = () => {
    setTheme({
      primary: tempColorValues.primary,
      secondary: tempColorValues.secondary,
      accent: tempColorValues.accent,
      mode: tempColorValues.mode
    });
  };

  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance - a measure of brightness
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for bright colors, white for dark ones
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          {t('Theme Customizer')}
        </CardTitle>
        <CardDescription>
          {t('Personalize your portal with custom colors')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="presets">{t('Preset Themes')}</TabsTrigger>
            <TabsTrigger value="custom">{t('Custom Colors')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(PRESET_THEMES).map(([name, presetTheme]) => (
                <div
                  key={name}
                  className={`cursor-pointer overflow-hidden rounded-lg border-2 hover:border-primary transition-all ${
                    currentThemeName === name ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
                  }`}
                  onClick={() => handlePresetSelection(name as keyof typeof PRESET_THEMES)}
                >
                  <div className="h-20 grid grid-cols-3">
                    <div 
                      className="col-span-3 h-10"
                      style={{ backgroundColor: presetTheme.primary }}
                    >
                      {currentThemeName === name && (
                        <div className="flex justify-end p-1">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="h-10" style={{ backgroundColor: presetTheme.secondary }}></div>
                    <div className="h-10" style={{ backgroundColor: presetTheme.accent }}></div>
                    <div className="h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-white border border-gray-200 shadow-sm"></div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3">
                    <p className="text-sm font-medium">
                      {t(name.charAt(0).toUpperCase() + name.slice(1))}
                    </p>
                    <p className="text-xs text-gray-500">
                      {name === 'default' ? t('University default') : 
                       name === 'rwanda' ? t('Rwanda flag colors') :
                       name === 'academic' ? t('Academic colors') :
                       name === 'tech' ? t('Technology focus') :
                       name === 'forest' ? t('Nature inspired') :
                       name === 'night' ? t('Dark blue theme') : 
                       t('Custom theme')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">{t('Select Color Type')}</h3>
                  <div className="flex space-x-3">
                    <button
                      className={`px-4 py-2 rounded-md flex items-center ${
                        activeColorType === 'primary' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                      onClick={() => setActiveColorType('primary')}
                    >
                      <span 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: tempColorValues.primary }}
                      ></span>
                      {t('Primary')}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md flex items-center ${
                        activeColorType === 'secondary' 
                          ? 'bg-secondary text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                      onClick={() => setActiveColorType('secondary')}
                    >
                      <span 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: tempColorValues.secondary }}
                      ></span>
                      {t('Secondary')}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md flex items-center ${
                        activeColorType === 'accent' 
                          ? 'bg-accent text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                      onClick={() => setActiveColorType('accent')}
                    >
                      <span 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: tempColorValues.accent }}
                      ></span>
                      {t('Accent')}
                    </button>
                  </div>
                </div>
                
                <div className="color-picker-container mb-4">
                  <HexColorPicker 
                    color={tempColorValues[activeColorType]} 
                    onChange={handleCustomColorChange} 
                    className="w-full"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium">
                    {t('Hex Color Value')}
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tempColorValues[activeColorType]}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span 
                      className="w-10 rounded-r-md border border-l-0 border-gray-300"
                      style={{ backgroundColor: tempColorValues[activeColorType] }}
                    ></span>
                  </div>
                </div>
                
                <Button onClick={applyCustomTheme} className="w-full">
                  <Paintbrush className="h-4 w-4 mr-2" />
                  {t('Apply Custom Colors')}
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">{t('Preview')}</h3>
                <div className="border rounded-lg overflow-hidden mb-4">
                  {/* Header */}
                  <div 
                    style={{ backgroundColor: tempColorValues.primary, color: getContrastColor(tempColorValues.primary) }}
                    className="p-4 flex justify-between items-center"
                  >
                    <div className="font-bold">{t('University Portal')}</div>
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <span style={{ color: tempColorValues.primary }} className="text-xs font-bold">U</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="col-span-2 flex items-center justify-between p-3 rounded"
                        style={{ backgroundColor: tempColorValues.primary, color: getContrastColor(tempColorValues.primary) }}
                      >
                        <span>{t('Welcome back')}</span>
                        <span>{t('Menu')}</span>
                      </div>
                      <div className="p-3 rounded text-center"
                        style={{ backgroundColor: tempColorValues.secondary, color: getContrastColor(tempColorValues.secondary) }}
                      >
                        {t('Courses')}
                      </div>
                      <div className="p-3 rounded text-center"
                        style={{ backgroundColor: tempColorValues.accent, color: getContrastColor(tempColorValues.accent) }}
                      >
                        {t('Assignments')}
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
                      <div className="h-full rounded" 
                        style={{ 
                          width: '60%', 
                          backgroundColor: tempColorValues.primary 
                        }}
                      ></div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button className="px-2 py-1 text-xs rounded text-white"
                        style={{ backgroundColor: tempColorValues.primary }}
                      >
                        {t('Button')}
                      </button>
                      <button className="px-2 py-1 text-xs rounded text-white"
                        style={{ backgroundColor: tempColorValues.secondary }}
                      >
                        {t('Button')}
                      </button>
                      <button className="px-2 py-1 text-xs rounded text-white"
                        style={{ backgroundColor: tempColorValues.accent }}
                      >
                        {t('Button')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}