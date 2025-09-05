import React, { useRef, useState } from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap'

// dejamos la interface como me pediste
interface IHorizontalNavProps {
  menuItems?
}

const calculateMenuItemWidth = (
  label: string,
  position?: string,
  isOthers?: boolean,
): number => {
  const container = document.createElement('div')

  if (position === 'first') {
    container.classList.add('pr-md-2', 'pr-lg-4')
  } else if (position === 'last' || isOthers) {
    container.classList.add('pl-md-2', 'pl-lg-4')
  } else {
    container.classList.add('px-md-2', 'px-lg-4')
  }

  container.style.width = 'min-content'

  const element = document.createElement('div')
  element.style.width = 'min-content'
  element.style.whiteSpace = 'nowrap'
  element.textContent = label

  if (isOthers) {
    element.style.padding = '0 2rem'
  } else {
    element.style.padding = '0 1rem'
  }
  element.style.margin = '1px'

  container.appendChild(element)
  document.body.appendChild(container)

  const width = container.getBoundingClientRect().width
  document.body.removeChild(container)

  return Math.ceil(width)
}

const HorizontalNav: React.FC<IHorizontalNavProps> = props => {
  const navRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const subMenuRefs = useRef<Array<Array<HTMLAnchorElement | null>>>([])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Función para cerrar menú cuando se pierde foco
  const handleBlur = (index: number, event: React.FocusEvent) => {
    setTimeout(() => {
      const focused = document.activeElement
      const navEl = navRefs.current[index]
      const subEls = subMenuRefs.current[index] || []

      if (
        navEl !== focused &&
        !subEls.some(el => el === focused)
      ) {
        setOpenIndex(null)
      }
    }, 0)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const total = navRefs.current.length

    if (e.key === 'ArrowRight') {
      const next = (index + 1) % total
      setOpenIndex(null)
      if (navRefs.current[next]) {
        navRefs.current[next]!.focus()
      }
      e.preventDefault()
    } else if (e.key === 'ArrowLeft') {
      const prev = (index - 1 + total) % total
      setOpenIndex(null)
      if (navRefs.current[prev]) {
        navRefs.current[prev]!.focus()
      }
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      if (
        props.menuItems &&
        props.menuItems[index] &&
        props.menuItems[index].subItems &&
        props.menuItems[index].subItems.length
      ) {
        setOpenIndex(index)
        setTimeout(function () {
          if (
            subMenuRefs.current[index] &&
            subMenuRefs.current[index][0]
          ) {
            subMenuRefs.current[index][0]!.focus()
          }
        }, 0)
      }
      e.preventDefault()
    }
  }

  const handleSubMenuKeyDown = (
    e: React.KeyboardEvent,
    parentIndex: number,
    subIndex: number,
  ) => {
    const list = subMenuRefs.current[parentIndex] || []
    const total = list.length

    if (e.key === 'ArrowDown') {
      const next = (subIndex + 1) % total
      if (list[next]) list[next]!.focus()
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      const prev = (subIndex - 1 + total) % total
      if (list[prev]) list[prev]!.focus()
      e.preventDefault()
    } else if (e.key === 'Escape') {
      setOpenIndex(null)
      if (navRefs.current[parentIndex]) {
        navRefs.current[parentIndex]!.focus()
      }
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      const next = (parentIndex + 1) % navRefs.current.length
      setOpenIndex(null)
      if (navRefs.current[next]) {
        navRefs.current[next]!.focus()
      }
      e.preventDefault()
    } else if (e.key === 'ArrowLeft') {
      const prev =
        (parentIndex - 1 + navRefs.current.length) %
        navRefs.current.length
      setOpenIndex(null)
      if (navRefs.current[prev]) {
        navRefs.current[prev]!.focus()
      }
      e.preventDefault()
    }
  }

  const menuItems = props.menuItems || []

  return (
    <div className="navbar-dark navbar-bg-dark w-100 px-3">
      <Nav role="menubar" className="mx-3 nav-pills navbar-dark px3">
        {menuItems.map((item, i) => {
          const w = calculateMenuItemWidth(item.label, item.position)
          console.log(`Width calculado para "${item.label}" →`, w)

          let spacingClass = ''
          if (item.position === 'first') {
            spacingClass = 'pr-lg-4'
          } else if (item.position === 'last') {
            spacingClass = 'pl-lg-4'
          } else {
            spacingClass = 'pr-lg-4 pl-lg-4'
          }

          return (
            <NavItem
              key={i}
              role="none"
              className={`my-1 dropdown nav-item ${spacingClass} dropdown-parent ${openIndex === i ? 'show-dropdown' : ''}`}
              style={{ position: 'relative' }} // Necesario para posicionar el dropdown absoluto
            >
              <NavLink
                href="#"
                role="menuitem"
                tabIndex={i === 0 ? 0 : -1}
                innerRef={el => (navRefs.current[i] = el)}
                onKeyDown={e => handleKeyDown(i, e)}
                onBlur={e => handleBlur(i, e)}
                aria-haspopup="true"
                aria-expanded={openIndex === i}
                className="py-2 item-nav-focus text-white nav-link"
                onClick={e => {
                  e.preventDefault()
                  setOpenIndex(openIndex === i ? null : i)
                }}
              >
                {item.label}
              </NavLink>

              {item.subItems && openIndex === i && (
                <ul
                  className="dropdown-menu show  dropdown-menu-centered"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1050,
                    border: '1px solid rgba(0, 0, 0, .15)', // borde que mencionaste
                  }}
                >
                  {item.subItems.map((sub, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        role="menuitem"
                        tabIndex={-1}
                        ref={el => {
                          if (!subMenuRefs.current[i]) {
                            subMenuRefs.current[i] = []
                          }
                          subMenuRefs.current[i][j] = el
                        }}
                        onKeyDown={e =>
                          handleSubMenuKeyDown(e, i, j)
                        }
                        onBlur={e => handleBlur(i, e)}
                        className="dropdown-item"
                      >
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </NavItem>
          )
        })}
      </Nav>
    </div>
  )
}

export default HorizontalNav
