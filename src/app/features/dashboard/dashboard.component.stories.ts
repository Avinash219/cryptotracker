import { BehaviorSubject, of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import {
  Meta,
  moduleMetadata,
  StoryContext,
  StoryObj,
} from '@storybook/angular';
import { CryptoApiService } from '../../core/crypto-api.service';
import { FormControl } from '@angular/forms';
import { DashboardStore } from './dashboard.store';
import { SearchStore } from '../search/search.store';

const mockCoins = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 45000,
    price_change_percentage_24h: 2.3,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3200,
    price_change_percentage_24h: -1.1,
  },
];

const meta: Meta<DashboardComponent> = {
  title: 'Dashboard Component',
  component: DashboardComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        {
          provide: CryptoApiService,
          useValue: {
            getCoinsBySearch: () => of([]), // returns empty list
            getTopCoins: () => of([]), // replace with mock coin list if needed
          },
        },
      ],
    }),
  ],
};

export const Default: Story = {
  args: {
    coin$: of(mockCoins),
  },
};

export const Loading: Story = {
  args: {
    loading$: of(true),
    coin$: of([]),
  },
};

export const WithCoins: Story = {
  args: {
    loading$: of(false),
    coin$: of([
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image:
          'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
        current_price: 1493.09,
        price_change_percentage_24h: -16.51028,
      },
    ]),
  },
};

export const ErrorState: Story = {
  args: {
    loading$: of(false),
    error$: of('Something went wrong'),
  },
};

export const CoinsWithSearch: Story = {
  args: {
    coin$: of(mockCoins),
    loading$: of(false),
    searchControl: new FormControl('Bitc'),
  },
};

export const RefreshClickNew: StoryObj<DashboardComponent> = {
  args: {
    searchControl: new FormControl(''),
  },
  decorators: [
    moduleMetadata({
      providers: (() => {
        const coinSubject = new BehaviorSubject<any[]>([]);
        const loadingSubject = new BehaviorSubject<boolean>(false);

        return [
          {
            provide: DashboardStore,
            useValue: {
              coin$: coinSubject.asObservable(),
              loading$: loadingSubject.asObservable(),
              error$: of(null),
              fetchTopCoins: () => {
                console.log('🔁 fetchTopCoins() called');
                loadingSubject.next(true);
                setTimeout(() => {
                  console.log('✅ Coin list updated');
                  coinSubject.next([
                    {
                      id: 'bitcoin',
                      name: 'Bitcoin',
                      image:
                        'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                      current_price: 45000,
                      price_change_percentage_24h: 1.25,
                    },
                    {
                      id: 'ethereum',
                      name: 'Ethereum',
                      image:
                        'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
                      current_price: 3200,
                      price_change_percentage_24h: -2.1,
                    },
                  ]);
                  loadingSubject.next(false);
                }, 1000);
              },
            },
          },
          {
            provide: SearchStore,
            useValue: {
              results$: of([]),
              searchEffect: () => {},
              loading$: of(false),
              error$: of(null),
            },
          },
          {
            provide: CryptoApiService,
            useValue: {
              getTopCoins: () => of([]),
              getCoinsBySearch: () => of([]),
            },
          },
        ];
      })(),
    }),
  ],
  render: (args) => ({
    props: args,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 100)); // wait for view init
    const btn = canvasElement.querySelector(
      '[data-testid="refresh-btn"]'
    ) as HTMLButtonElement;
    console.log('🧪 Clicking refresh button:', btn?.textContent);
    btn?.click();
  },
};

export default meta;
type Story = StoryObj<DashboardComponent>;
