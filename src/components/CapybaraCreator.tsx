
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

export type Capybara = {
  name: string;
  element: string;
  class: string;
  weapon: string;
  weaponEmoji: string;
  avatar: string;
};


const elements = [
  // Базовые элементы
  { value: 'fire', label: 'Огонь 🔥', rarity: 'common' },
  { value: 'water', label: 'Вода 💧', rarity: 'common' },
  { value: 'earth', label: 'Земля 🌍', rarity: 'common' },
  { value: 'air', label: 'Воздух 💨', rarity: 'common' },
  { value: 'lightning', label: 'Молния ⚡', rarity: 'common' },
  // Редкие элементы
  { value: 'darkness', label: 'Тьма 🌑', rarity: 'rare' },
  { value: 'shadow', label: 'Тень 👥', rarity: 'rare' },
  { value: 'dj', label: 'Диджей 🎧', rarity: 'rare' },
  { value: 'light', label: 'Свет ✨', rarity: 'rare' },
  // Гибридные элементы
  { value: 'steam', label: 'Пар (Вода + Огонь) 💨🔥', rarity: 'hybrid' },
  { value: 'lava', label: 'Лава (Огонь + Земля) 🌋', rarity: 'hybrid' },
  { value: 'ice', label: 'Лёд (Вода + Воздух) ❄️', rarity: 'hybrid' },
  { value: 'storm', label: 'Шторм (Воздух + Молния) 🌩️', rarity: 'hybrid' },
  { value: 'metal', label: 'Металл (Земля + Молния) 🔩', rarity: 'hybrid' },
  { value: 'nature', label: 'Природа (Земля + Вода) 🌿', rarity: 'hybrid' },
];


const classes = [
  { value: 'warrior', label: 'Воин ⚔️' },
  { value: 'mage', label: 'Маг 🧙‍♂️' },
  { value: 'rogue', label: 'Разбойник 🗡️' },
  { value: 'healer', label: 'Целитель 💚' },
  { value: 'tank', label: 'Танк 🛡️' },
];

const avatars = [
  'https://images.unsplash.com/photo-1575545336544-4628c87afcde?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591382386627-349b692688ff?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524721696987-b9527df9e512?w=800&auto=format&fit=crop',
];

interface CapybaraCreatorProps {
  onSave: (capybara: Capybara) => void;
}

const CapybaraCreator = ({ onSave }: CapybaraCreatorProps) => {
  const [capybara, setCapybara] = useState<Capybara>({
    name: '',
    element: '',
    class: '',
    weapon: '',
    weaponEmoji: '',
    avatar: avatars[0],
  });

  const handleChange = (key: keyof Capybara, value: string) => {
    setCapybara((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (capybara.name && capybara.element && capybara.class && capybara.weapon) {
      onSave(capybara);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Создай свою Капибару</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя капибары</Label>
          <Input
            id="name"
            placeholder="Введите имя"
            value={capybara.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Выберите элемент</Label>
          <Select
            value={capybara.element}
            onValueChange={(value) => handleChange('element', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите элемент" />
            </SelectTrigger>
            <SelectContent>
              {elements.map((element) => (
                <SelectItem key={element.value} value={element.value}>
                  {element.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Выберите класс</Label>
          <Select
            value={capybara.class}
            onValueChange={(value) => handleChange('class', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите класс" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.value} value={cls.value}>
                  {cls.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weapon">Оружие</Label>
          <Input
            id="weapon"
            placeholder="Опишите оружие"
            value={capybara.weapon}
            onChange={(e) => handleChange('weapon', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weaponEmoji">Смайлики оружия</Label>
          <Textarea
            id="weaponEmoji"
            placeholder="Используйте смайлики для описания оружия"
            value={capybara.weaponEmoji}
            onChange={(e) => handleChange('weaponEmoji', e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Выберите аватар</Label>
          <RadioGroup
            value={capybara.avatar}
            onValueChange={(value) => handleChange('avatar', value)}
            className="grid grid-cols-2 gap-4"
          >
            {avatars.map((avatar, index) => (
              <div key={index} className="relative">
                <RadioGroupItem
                  value={avatar}
                  id={`avatar-${index}`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`avatar-${index}`}
                  className="cursor-pointer block overflow-hidden rounded-md"
                >
                  <img
                    src={avatar}
                    alt={`Аватар ${index + 1}`}
                    className={`w-full h-32 object-cover transition-all ${
                      capybara.avatar === avatar
                        ? 'ring-4 ring-primary'
                        : 'hover:opacity-80'
                    }`}
                  />
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full">
          <Icon name="Check" className="mr-2" size={16} />
          Создать капибару
        </Button>
      </form>
    </div>
  );
};

export default CapybaraCreator;
