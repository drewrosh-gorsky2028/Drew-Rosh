import { useZoo } from '../state/ZooContext.jsx';
import { DECORATION_LIST } from '../data/decorations.js';
import { DecorationArt } from './scenery/Decorations.jsx';
import { Modal } from './ui/Modal.jsx';
import { Icon } from './ui/Icon.jsx';

export function Shop({ onClose, onDecorate }) {
  const { state, dispatch } = useZoo();
  const owned = (kind) => state.decorations.filter((d) => d.kind === kind).length;
  const stored = state.decorations.filter((d) => !d.habitatId).length;

  return (
    <Modal title="Zoo shop" onClose={onClose} wide>
      <div className="shop-wallet">
        <Icon name="coin" size={26} />
        <strong>{state.coins}</strong> coins
        <span className="muted">· earn more by completing tasks (small 10, medium 25, large 50)</span>
      </div>
      <ul className="shop-grid">
        {DECORATION_LIST.map((item) => {
          const affordable = state.coins >= item.price;
          return (
            <li key={item.id} className="shop-item">
              <div className="shop-art">
                <DecorationArt kind={item.id} width={Math.min(90, item.w)} />
              </div>
              <strong>{item.name}</strong>
              <span className="muted">Owned: {owned(item.id)}</span>
              <button
                className="btn btn--primary btn--small"
                disabled={!affordable}
                onClick={() => dispatch({ type: 'BUY_DECOR', kind: item.id })}
              >
                <Icon name="coin" size={16} /> {item.price}
              </button>
            </li>
          );
        })}
      </ul>
      {stored > 0 && (
        <div className="shop-footer">
          <span>
            {stored} item{stored === 1 ? '' : 's'} waiting to be placed.
          </span>
          <button className="btn btn--primary" onClick={onDecorate}>
            <Icon name="brush" size={18} /> Decorate now
          </button>
        </div>
      )}
    </Modal>
  );
}
