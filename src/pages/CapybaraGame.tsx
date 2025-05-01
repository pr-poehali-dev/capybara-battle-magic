
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import CapybaraCreator, { type Capybara } from '@/components/CapybaraCreator';
import BattleArena from '@/components/BattleArena';

const CapybaraGame = () => {
  const [gameState, setGameState] = useState<'menu' | 'create' | 'battle'>('menu');
  const [mode, setMode] = useState<'pvp' | 'pve'>('pvp');
  const [player1, setPlayer1] = useState<Capybara | null>(null);
  const [player2, setPlayer2] = useState<Capybara | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

  // Создадим базовую капибару для режима PvE
  const createAICapybara = (): Capybara => {
    const elements = ['fire', 'water', 'earth', 'air', 'lightning'];
    const classes = ['warrior', 'mage', 'rogue', 'healer', 'tank'];
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    
    return {
      name: 'Кибер-Капибара',
      element: randomElement,
      class: randomClass,
      weapon: 'Кибер-бластер',
      weaponEmoji: '🔫🤖✨',
      avatar: 'https://images.unsplash.com/photo-1591382386627-349b692688ff?w=800&auto=format&fit=crop',
    };
  };
  
  const handleCreateCapybara = (capybara: Capybara) => {
    if (currentPlayer === 1) {
      setPlayer1(capybara);
      
      if (mode === 'pvp') {
        setCurrentPlayer(2);
      } else {
        // В режиме PvE создаем компьютерного противника
        setPlayer2(createAICapybara());
        setGameState('battle');
      }
    } else {
      setPlayer2(capybara);
      setGameState('battle');
    }
  };
  
  const startGame = (selectedMode: 'pvp' | 'pve') => {
    setMode(selectedMode);
    setPlayer1(null);
    setPlayer2(null);
    setCurrentPlayer(1);
    setGameState('create');
  };
  
  const returnToMenu = () => {
    setGameState('menu');
    setPlayer1(null);
    setPlayer2(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Магическая Битва Капибар</h1>
        
        {gameState === 'menu' && (
          <Card className="max-w-lg mx-auto p-6 text-center">
            <h2 className="text-2xl font-semibold mb-6">Выберите режим игры</h2>
            
            <div className="grid gap-4 mb-8">
              <Button 
                size="lg" 
                className="h-20 text-lg"
                onClick={() => startGame('pvp')}
              >
                <Icon name="Users" className="mr-2" size={24} />
                Два игрока (PvP)
              </Button>
              
              <Button 
                size="lg" 
                className="h-20 text-lg"
                onClick={() => startGame('pve')}
                variant="outline"
              >
                <Icon name="Bot" className="mr-2" size={24} />
                Против компьютера (PvE)
              </Button>
            </div>
            
            <p className="text-gray-600 mt-4">
              Создайте уникальную капибару с особыми способностями и вступите в магическую битву!
            </p>
          </Card>
        )}
        
        {gameState === 'create' && (
          <div className="max-w-lg mx-auto">
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={returnToMenu}
            >
              <Icon name="ArrowLeft" className="mr-2" size={16} />
              Назад в меню
            </Button>
            
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                {mode === 'pvp' 
                  ? `Создание персонажа для Игрока ${currentPlayer}` 
                  : 'Создание вашего персонажа'}
              </h2>
              
              <CapybaraCreator onSave={handleCreateCapybara} />
            </Card>
          </div>
        )}
        
        {gameState === 'battle' && player1 && player2 && (
          <div>
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={returnToMenu}
            >
              <Icon name="ArrowLeft" className="mr-2" size={16} />
              Выйти из боя
            </Button>
            
            <BattleArena 
              player1={player1} 
              player2={player2}
              mode={mode}
              onEnd={returnToMenu}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CapybaraGame;
