__pragma__('skip')
document = window = Math = Date = 0  # Prevent complaints by optional static checker
__pragma__('noskip')


# Helper functions


def h(elm_type, props='', *args):
    """
    :param elm_type: str
    :param str|dict|None props: Props
    """
    return React.createElement(elm_type, props, *args)


def h1(props='', *args):
    """
    :param str|dict|None props: Props
    """
    return h('h1', props, *args)


def p(props='', *args):
    """
    :param str|dict|None props: Props
    """
    return h('p', props, *args)


def div(props='', *args):
    """
    :param str|dict|None props: Props
    """
    return h('div', props, *args)


def render(react_element, destination_id, callback=lambda: None):
    container = document.getElementById(destination_id)
    ReactDOM.render(react_element, container, callback)


# Create a component

def getInitialState():
    return {'counter': 0}


#### FROM ORIGINAL EXAMPLE -- WORKS ####
# Hello = React.createClass({
#     'displayName': 'Hello',
#
#     'getInitialState': getInitialState,
#
#     'updateCounter': lambda: (this.setState({'counter': str([1, 2, 3] == ',,')})),
#
#     'componentDidMount': lambda: (setInterval(this.updateCounter, 1000)),
#
#     'render': lambda: div({'className': 'maindiv'},
#                           h1(None, 'Hello', this.props['name']),
#                           p(None, 'Lorem ipsum dolor sit ame.'),
#                           p(None, 'Counter: ', this.state['counter'])
#                           )
# })

####  DOESNT WORK ####
class Hello(React.Component):
    displayName = 'Hello'

    def __init__(self, **props):
        self.state = {'counter': 0}
        self.props = props

    def updateCounter(self):
        self.state['counter'] += 1

    def componentDidMount(self):
        setInterval(self.updateCounter, 1000)

    def render(self):
        return div({'className': 'maindiv'},
                   h1('Hello', self.props['name']),
                   p('Lorem ipsum dolor sit ame.'),
                   p('Counter: ', self.state['counter'])
                   )


# Render the component in a 'container' div

element = React.createElement(Hello, {'name': 'React!'})
render(element, 'container')


# if __name__ == "__main__":
#     """
#     TODO: Transpile HelloComponent into ES5-style syntax.
#
#     1) class HelloComponent(React.Component):  ->  React.createClass({
#
#     2) self -> this
#
#     3) __init__ constructor -> getInitialState
#
#     4) (Optional) HTML elements -> h() thing. If an arg is a dict, should be a prop.
#     """
#     pass