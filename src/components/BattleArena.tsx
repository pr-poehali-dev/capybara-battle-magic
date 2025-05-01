
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { type Capybara } from './CapybaraCreator';


type Attack = {
  name: string;
  damage: number;
  element: string;
  effect: string;
  isUltimate?: boolean;
};

type BattleState = {
  turn: number;
  player1Health: number;
  player2Health: number;
  battleLog: string[];
  gameOver: boolean;
  winner: string | null;
};

const generateAttacks = (capybara: Capybara): Attack[] => {
  const basicAttacks: Attack[] = [
    {
      name: 'Укус',
      damage: 10,
      element: 'physical',
      effect: '🦷 Укус зубами',
    },
    {
      name: 'Толчок',
      damage: 8,
      element: 'physical',
      effect: '💨 Мощный толчок',
    },
  ];

  // Создаем атаки на основе элемента
  const elementalAttack: Attack = {
    name: `${getElementName(capybara.element)} удар`,
    damage: 15,
    element: capybara.element,
    effect: getElementEffect(capybara.element),
  };

  // Создаем атаки на основе класса
  const classAttack: Attack = {
    name: `${getClassName(capybara.class)} прием`,
    damage: 18,
    element: capybara.element,
    effect: getClassEffect(capybara.class),
  };

  // Создаем атаку на основе оружия
  const weaponAttack: Attack = {
    name: `Удар ${capybara.weapon}`,
    damage: 20,
    element: capybara.element,
    effect: `${capybara.weaponEmoji || '🗡️'} Мощная атака оружием`,
  };

  return [...basicAttacks, elementalAttack, classAttack, weaponAttack];
};


const getElementName = (element: string): string => {
  const names: Record<string, string> = {
    fire: 'Огненный',
    water: 'Водяной',
    earth: 'Земляной',
    air: 'Воздушный',
    lightning: 'Молниеносный',
    darkness: 'Тёмный',
    shadow: 'Теневой',
    dj: 'Диджейский',
    light: 'Светлый',
    steam: 'Паровой',
    lava: 'Лавовый',
    ice: 'Ледяной',
    storm: 'Штормовой',
    metal: 'Металлический',
    nature: 'Природный',
  };
  return names[element] || 'Магический';
};


const getElementEffect = (element: string): string => {
  const effects: Record<string, string> = {
    fire: '🔥 Обжигающее пламя',
    water: '💧 Мощный поток воды',
    earth: '🌍 Атака камнями',
    air: '💨 Ураганный ветер',
    lightning: '⚡ Разряд молнии',
  };
  return effects[element] || '✨ Магический эффект';
};

const getClassName = (className: string): string => {
  const names: Record<string, string> = {
    warrior: 'Воинский',
    mage: 'Магический',
    rogue: 'Скрытный',
    healer: 'Целительный',
    tank: 'Защитный',
  };
  return names[className] || 'Тактический';
};

const getClassEffect = (className: string): string => {
  const effects: Record<string, string> = {
    warrior: '⚔️ Мощный удар мечом',
    mage: '🔮 Магический заряд',
    rogue: '🗡️ Внезапный удар в спину',
    healer: '💚 Исцеляющий удар',
    tank: '🛡️ Сокрушительный щит',
  };
  return effects[className] || '🎯 Тактический прием';
};

interface BattleArenaProps {
  player1: Capybara;
  player2: Capybara;
  mode: 'pvp' | 'pve';
  onEnd: (winner: string) => void;
}

const BattleArena = ({ player1, player2, mode, onEnd }: BattleArenaProps) => {
  const [player1Attacks] = useState<Attack[]>(generateAttacks(player1));
  const [player2Attacks] = useState<Attack[]>(generateAttacks(player2));
  const [battleState, setBattleState] = useState<BattleState>({
    turn: 1,
    player1Health: 100,
    player2Health: 100,
    battleLog: ['Битва началась!'],
    gameOver: false,
    winner: null,
  });
  
  const [currentEffect, setCurrentEffect] = useState<string | null>(null);

  const performAttack = (attack: Attack, attacker: 'player1' | 'player2') => {
    if (battleState.gameOver) return;
    
    setBattleState((prev) => {
      const isPlayer1 = attacker === 'player1';
      const attackerName = isPlayer1 ? player1.name : player2.name;
      const defenderName = isPlayer1 ? player2.name : player1.name;
      
      // Расчет урона
      let damage = attack.damage;
      
      // Обновляем здоровье
      const newPlayer1Health = isPlayer1 ? prev.player1Health : Math.max(0, prev.player1Health - damage);
      const newPlayer2Health = isPlayer1 ? Math.max(0, prev.player2Health - damage) : prev.player2Health;
      
      // Проверка на окончание игры
      const newGameOver = newPlayer1Health <= 0 || newPlayer2Health <= 0;
      let newWinner = null;
      if (newGameOver) {
        newWinner = newPlayer1Health <= 0 ? player2.name : player1.name;
        if (newWinner) onEnd(newWinner);
      }
      
      // Лог атаки
      const logEntry = `${attackerName} использует "${attack.name}" и наносит ${damage} урона! ${attack.effect}`;
      
      // Показываем эффект атаки
      setCurrentEffect(attack.effect);
      setTimeout(() => setCurrentEffect(null), 1000);
      
      return {
        turn: prev.turn + 1,
        player1Health: newPlayer1Health,
        player2Health: newPlayer2Health,
        battleLog: [logEntry, ...prev.battleLog],
        gameOver: newGameOver,
        winner: newWinner,
      };
    });
  };

  // AI ход для режима PvE
  useEffect(() => {
    if (mode === 'pve' && battleState.turn % 2 === 0 && !battleState.gameOver) {
      const timeout = setTimeout(() => {
        // AI выбирает случайную атаку
        const randomAttackIndex = Math.floor(Math.random() * player2Attacks.length);
        performAttack(player2Attacks[randomAttackIndex], 'player2');
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [battleState.turn, battleState.gameOver, mode]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Игрок 1 */}
        <Card className="p-4 relative overflow-hidden">
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src={player1.avatar} 
              alt={player1.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
            />
            <div>
              <h3 className="text-xl font-bold">{player1.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{getElementName(player1.element)} {getClassName(player1.class)}</span>
              </div>
              <div className="mt-1">
                <div className="bg-gray-200 rounded-full h-4 w-full">
                  <div 
                    className="bg-green-500 h-4 rounded-full" 
                    style={{ width: `${battleState.player1Health}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{battleState.player1Health}/100 HP</span>
              </div>
            </div>
          </div>
          
          {(battleState.turn % 2 === 1 || mode === 'pvp') && !battleState.gameOver && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {player1Attacks.map((attack, index) => (
                <Button 
                  key={index}
                  onClick={() => performAttack(attack, 'player1')}
                  variant="outline"
                  disabled={mode === 'pvp' && battleState.turn % 2 === 0}
                  className="text-sm justify-start"
                >
                  <span className="truncate">{attack.name}</span>
                </Button>
              ))}
            </div>
          )}
        </Card>

        {/* Игрок 2 */}
        <Card className="p-4 relative overflow-hidden">
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src={player2.avatar} 
              alt={player2.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-red-500"
            />
            <div>
              <h3 className="text-xl font-bold">{player2.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{getElementName(player2.element)} {getClassName(player2.class)}</span>
              </div>
              <div className="mt-1">
                <div className="bg-gray-200 rounded-full h-4 w-full">
                  <div 
                    className="bg-green-500 h-4 rounded-full" 
                    style={{ width: `${battleState.player2Health}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{battleState.player2Health}/100 HP</span>
              </div>
            </div>
          </div>
          
          {mode === 'pvp' && battleState.turn % 2 === 0 && !battleState.gameOver && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {player2Attacks.map((attack, index) => (
                <Button 
                  key={index}
                  onClick={() => performAttack(attack, 'player2')}
                  variant="outline"
                  className="text-sm justify-start"
                >
                  <span className="truncate">{attack.name}</span>
                </Button>
              ))}
            </div>
          )}
          
          {mode === 'pve' && (
            <div className="mt-4 p-2 bg-gray-100 rounded">
              <p className="text-sm text-center font-medium">Компьютерный противник</p>
            </div>
          )}
        </Card>
      </div>
      
      {/* Эффект атаки */}
      {currentEffect && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-4xl animate-fade-in opacity-0">
            {currentEffect}
          </div>
        </div>
      )}
      
      {/* Лог боя */}
      <Card className="mt-6 p-4 max-h-60 overflow-y-auto">
        <h3 className="font-bold mb-2">Хроника боя:</h3>
        <ul className="space-y-1">
          {battleState.battleLog.map((log, index) => (
            <li key={index} className="text-sm border-b pb-1">{log}</li>
          ))}
        </ul>
      </Card>
      
      {/* Сообщение о конце игры */}
      {battleState.gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4">Бой окончен!</h2>
            <p className="text-xl">Победитель: {battleState.winner}</p>
            <Button 
              className="mt-4"
              onClick={() => onEnd(battleState.winner || '')}
            >
              Вернуться в меню
            </Button>
          </Card>
        </div>
      )}
      
      {/* Индикатор текущего хода */}
      <div className="mt-4 text-center">
        {!battleState.gameOver && (
          <p className="font-medium">
            {mode === 'pvp' 
              ? `Ход игрока: ${battleState.turn % 2 === 1 ? player1.name : player2.name}`
              : battleState.turn % 2 === 1 
                ? 'Ваш ход' 
                : 'Ход компьютера...'}
          </p>
        )}
      </div>
    </div>
  );
};

export default BattleArena;
